/* Python Quest advanced learning features: offline editor + optional cloud.
 * v2: Pyodide in a worker, Supabase Auth / RLS, leaderboard and AI tutor.
 */
(function () {
  "use strict";

  const config = window.PYTHON_QUEST_CONFIG || {};
  const challenges = window.QuestChallenges || [];
  const draftPrefix = "python-quest-draft-v2-";
  const lastResults = new Map();
  let quest;
  let sb = null;
  let cloudUser = null;
  let cloudProfile = null;
  let cloudLoading = false;
  let authMode = "signin";
  let mergeQueue = Promise.resolve();
  let syncDebounce = null;
  let suppressSync = false;
  let lastAuthUser = null;
  let tutorBusy = false;
  let pyWorker = null;
  let workerReady = null;
  let workerReadyResolve = null;
  let workerReadyReject = null;
  let workerRequests = new Map();
  let currentRequestId = 0;

  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? "").replace(/[&<>"']/g, ch =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  const isCloudConfigured = () => {
    try {
      const url = new URL(config.supabaseUrl || "");
      return url.protocol === "https:" && Boolean(config.supabasePublishableKey);
    } catch { return false; }
  };
  const findChallenge = day => challenges.find(item => item.day === Number(day));

  function createWorker() {
    disposeWorker(new Error("重启 Python 环境"));
    pyWorker = new Worker("./python-worker.mjs", { type: "module" });
    workerReady = new Promise((resolve, reject) => {
      workerReadyResolve = resolve;
      workerReadyReject = reject;
    });
    pyWorker.onmessage = event => {
      const msg = event.data || {};
      if (msg.type === "ready") {
        workerReadyResolve?.();
      }
      if (msg.type === "fatal") {
        const error = new Error(msg.error || "无法初始化 Python");
        workerReadyReject?.(error);
        for (const item of workerRequests.values()) item.reject(error);
        workerRequests.clear();
      }
      if (msg.type === "result" && workerRequests.has(msg.id)) {
        const request = workerRequests.get(msg.id);
        workerRequests.delete(msg.id);
        request.resolve(msg.data);
      }
    };
    pyWorker.onerror = event => {
      const error = new Error("Python 运行器初始化失败，检查网络或重新尝试");
      workerReadyReject?.(error);
      for (const item of workerRequests.values()) item.reject(error);
      workerRequests.clear();
      event.preventDefault();
    };
  }

  function disposeWorker(error = new Error("Python 工作线程已结束")) {
    if (pyWorker) pyWorker.terminate();
    pyWorker = null;
    if (workerReadyReject) workerReadyReject(error);
    workerReady = null;
    workerReadyResolve = null;
    workerReadyReject = null;
    for (const item of workerRequests.values()) item.reject(error);
    workerRequests.clear();
  }

  function withTimeout(promise, ms, errorMessage) {
    let timeout;
    return Promise.race([
      promise,
      new Promise((_, reject) => { timeout = setTimeout(() => reject(new Error(errorMessage)), ms); })
    ]).finally(() => clearTimeout(timeout));
  }

  async function evaluatePython(code, mode, tests) {
    if (!pyWorker) createWorker();
    try {
      await withTimeout(workerReady, 90000, "Python 环境加载超时，请检查网络后重试");
    } catch (error) {
      disposeWorker(error);
      throw error;
    }
    const id = ++currentRequestId;
    const pending = new Promise((resolve, reject) => workerRequests.set(id, { resolve, reject }));
    pyWorker.postMessage({ id, code, mode, tests: tests || [] });
    try {
      return await withTimeout(pending, 12000, "代码执行超过 12 秒，已停止此轮执行");
    } catch (error) {
      disposeWorker(error);
      throw error;
    }
  }

  function renderWorkbench(day) {
    const host = $("codingWorkbench");
    if (!host) return;
    const challenge = findChallenge(day);
    if (!challenge) {
      host.textContent = "本关暂无编程练习，请先完成其他关卡。";
      return;
    }
    const saved = localStorage.getItem(draftPrefix + day);
    const code = saved === null ? challenge.starter : saved;
    const previous = lastResults.get(day);
    host.innerHTML = '<div class="workbench-header"><div><span class="workbench-eyebrow">PYTHON PLAYGROUND</span><h3>💻 ' +
      esc(challenge.task) + '</h3><p>' + esc(challenge.signature) + '</p></div><span class="workbench-count">' +
      challenge.tests.length + ' 项测试</span></div>' +
      '<div class="editor-bar"><span>● ● ● &nbsp; solution.py</span><button id="resetCode" class="text-button">重置代码 ↺</button></div>' +
      '<textarea id="codeEditor" class="code-editor" spellcheck="false" aria-label="Python 代码编辑器"></textarea>' +
      '<div class="workbench-actions"><button class="button button-soft" id="runCode">▶ 运行代码</button>' +
      '<button class="button button-primary" id="judgeCode">⚡ 自动判题</button>' +
      '<span class="worker-message" id="workerStatus">首次运行需加载 Python 环境</span></div>' +
      '<div class="judge-output" id="judgeOutput" aria-live="polite"></div>' +
      '<div class="workbench-hint"><strong>💡 线索：</strong>' + esc(challenge.hint) + '</div>' +
      '<p class="workbench-safety">运行环境位于你的浏览器 Web Worker，不上传代码。仅练习本人可信代码，不是防恶意代码的安全沙箱。工程级任务仍需在本地完成。</p>';
    $("codeEditor").value = code;
    $("codeEditor").addEventListener("input", () => {
      localStorage.setItem(draftPrefix + day, $("codeEditor").value);
    });
    $("codeEditor").addEventListener("keydown", event => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        runPractice(day, "run");
      }
      if (event.key === "Tab") {
        event.preventDefault();
        const el = event.currentTarget;
        const index = el.selectionStart;
        el.setRangeText("    ", index, el.selectionEnd, "end");
        localStorage.setItem(draftPrefix + day, el.value);
      }
    });
    $("resetCode").onclick = () => {
      if (!window.confirm("确定重置本关代码？当前草稿会被覆盖。")) return;
      $("codeEditor").value = challenge.starter;
      localStorage.setItem(draftPrefix + day, challenge.starter);
      renderResult(null);
    };
    $("runCode").onclick = () => runPractice(day, "run");
    $("judgeCode").onclick = () => runPractice(day, "judge");
    if (previous) renderResult(previous);
  }

  function renderResult(result) {
    const output = $("judgeOutput");
    if (!output) return;
    if (!result) { output.replaceChildren(); return; }
    const data = result.data;
    if (data.failureMessage) {
      output.innerHTML = '<div class="result-summary fail">❌ ' + esc(data.failureMessage) + '</div>';
      return;
    }
    let content = '';
    if (result.mode === "judge") {
      const passed = data.tests.filter(test => test.passed).length;
      content += '<div class="result-summary ' + (data.ok ? "pass" : "fail") + '">' +
        (data.ok ? "🏆 挑战通过！" : "🛠️ 还差一点点") + ' · ' + passed + ' / ' + data.tests.length + ' 项测试通过</div>';
      content += '<div class="result-test-list">' + data.tests.map(test =>
        '<div class="result-test ' + (test.passed ? "pass" : "fail") + '"><span>' +
        (test.passed ? "✓" : "✕") + '</span><div><strong>' + esc(test.label) +
        '</strong>' + (test.error ? '<pre>' + esc(test.error) + '</pre>' : '') + '</div></div>'
      ).join("") + '</div>';
    } else {
      content += '<div class="result-summary ' + (data.ok ? "pass" : "fail") + '">' +
        (data.ok ? "▶ 运行完成" : "❌ 运行失败") + '</div>';
    }
    const logs = [data.stdout, data.stderr, data.error].filter(Boolean).join("\n");
    if (logs) content += '<pre class="console-output">' + esc(logs) + '</pre>';
    else if (result.mode === "run") content += '<div class="console-output">程序没有输出。可以添加 print() 查看结果。</div>';
    output.innerHTML = content;
  }

  async function runPractice(day, mode) {
    const editor = $("codeEditor");
    if (!editor || quest.activeDay() !== day) return;
    const challenge = findChallenge(day);
    const code = editor.value;
    if (!code.trim()) { quest.toast("请输入 Python 代码再运行"); return; }
    const runButton = $("runCode");
    const judgeButton = $("judgeCode");
    const status = $("workerStatus");
    runButton.disabled = judgeButton.disabled = true;
    status.textContent = "🐍 Python 正在运行...首次加载可能稍久";
    try {
      const data = await evaluatePython(code, mode, mode === "judge" ? challenge.tests : []);
      lastResults.set(day, { mode, data });
      renderResult({ mode, data });
      if (mode === "judge" && data.ok && data.tests.length === challenge.tests.length) {
        quest.setPracticePassed(day);
        quest.toast("🎉 自动判题通过！现在去完成知识闯关。");
      }
    } catch (error) {
      const failureMessage = error.message || "执行失败";
      const result = { mode, data: { failureMessage } };
      lastResults.set(day, result);
      renderResult(result);
    } finally {
      const freshStatus = $("workerStatus");
      if (freshStatus) freshStatus.textContent = "浏览器本地运行 · Ctrl / ⌘ + Enter 快速执行";
      if ($("runCode")) $("runCode").disabled = false;
      if ($("judgeCode")) $("judgeCode").disabled = false;
    }
  }

  function openCloud() {
    $("cloudModal").classList.add("open");
    $("cloudModal").setAttribute("aria-hidden", "false");
    renderCloud();
  }
  function closeCloud() {
    $("cloudModal").classList.remove("open");
    $("cloudModal").setAttribute("aria-hidden", "true");
  }
  function cloudNote(message) { $("cloudNote").textContent = message; }
  function renderCloud() {
    const enabled = isCloudConfigured();
    $("authForm").hidden = !enabled || Boolean(cloudUser);
    $("cloudLoggedIn").hidden = !enabled || !cloudUser;
    $("cloudStatus").textContent = cloudUser ? "已同步" : enabled ? "登录同步" : "本地存档";
    $("cloudAccountInfo").textContent = cloudUser ? "✅ 已登录：" + cloudUser.email : enabled ? "未登录 · 本地进度将保留" : "☁ 云服务尚未配置";
    $("cloudButton").classList.toggle("cloud-connected", Boolean(cloudUser));
    if (cloudUser) $("displayNameInput").value = cloudProfile?.display_name || "代码探险家";
    if (!enabled) cloudNote("仅需配置 Supabase 项目即可启用账号、同步与真实排行榜。站点离线学习、编程判题仍可使用；详见 README。");
  }

  async function initCloud() {
    if (!isCloudConfigured()) {
      renderCloud();
      renderLeaderboard([]);
      return;
    }
    cloudNote("正在初始化云端连接...");
    try {
      const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2.119.0");
      sb = createClient(config.supabaseUrl.replace(/\/$/, ""), config.supabasePublishableKey, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
      });
      sb.auth.onAuthStateChange((_event, session) => {
        window.setTimeout(() => handleSession(session).catch(error => cloudNote("云端同步异常：" + error.message)), 0);
      });
      const { data, error } = await sb.auth.getSession();
      if (error) throw error;
      await handleSession(data.session);
    } catch (error) {
      cloudNote("云端连接失败：" + error.message + "。本地课程仍然可使用。");
      renderLeaderboard([]);
    }
  }

  async function handleSession(session) {
    const user = session?.user || null;
    if (!user) {
      cloudUser = null;
      cloudProfile = null;
      lastAuthUser = null;
      renderCloud();
      renderLeaderboard([]);
      return;
    }
    cloudUser = user;
    renderCloud();
    if (lastAuthUser === user.id) return;
    lastAuthUser = user.id;
    await loadOrCreateProfile();
    await syncCloud();
    await refreshLeaderboard();
    cloudNote("数据已与当前账号同步，跨设备请使用同一个邮箱登录。");
    renderCloud();
  }

  async function loadOrCreateProfile() {
    const { data, error } = await sb.from("profiles").select("id,display_name").eq("id", cloudUser.id).maybeSingle();
    if (error) throw error;
    if (data) { cloudProfile = data; return; }
    const name = "探索者-" + cloudUser.id.slice(0, 6);
    const { data: created, error: createError } = await sb.from("profiles")
      .upsert({ id: cloudUser.id, display_name: name }, { onConflict: "id" }).select("id,display_name").single();
    if (createError) throw createError;
    cloudProfile = created;
  }

  function syncCloud() {
    if (!sb || !cloudUser) return Promise.resolve();
    mergeQueue = mergeQueue.catch(() => {}).then(async () => {
      if (!sb || !cloudUser) return;
      const currentUserId = cloudUser.id;
      const local = quest.getState();
      const practice = {};
      for (const [key, value] of Object.entries(local.practice || {})) {
        if (value === true && Number(key) >= 1 && Number(key) <= 30) practice[key] = true;
      }
      const { data, error } = await sb.rpc("merge_my_progress", {
        new_days: local.completed,
        new_practice: practice,
        new_streak: local.streak || 0,
        new_last_active: local.lastActiveDate || null
      });
      if (error) throw error;
      if (!cloudUser || cloudUser.id !== currentUserId) return;
      if (data) {
        suppressSync = true;
        try { quest.mergeCloudProgress(data); }
        finally { suppressSync = false; }
      }
      $("cloudStatus").textContent = "已同步";
    });
    return mergeQueue.catch(error => {
      $("cloudStatus").textContent = "同步待重试";
      cloudNote("云同步失败：" + error.message);
    });
  }

  async function refreshLeaderboard() {
    if (!sb || !cloudUser) { renderLeaderboard([]); return; }
    $("leaderboardList").innerHTML = '<div class="empty-state">正在读取真实玩家排名...</div>';
    const { data, error } = await sb.rpc("top_learners");
    if (error) {
      $("leaderboardList").textContent = "加载排行榜失败：" + error.message;
      return;
    }
    renderLeaderboard(data || []);
  }

  function renderLeaderboard(entries) {
    if (!cloudUser || !sb) {
      $("leaderboardList").innerHTML = '<div class="empty-state">👋 使用云账号登录后，可查看其他真实玩家的学习进度。未配置时不会展示虚构排名。</div>';
      return;
    }
    if (!entries.length) {
      $("leaderboardList").innerHTML = '<div class="empty-state">暂无排行榜记录，完成一个关卡成为第一名吧！</div>';
      return;
    }
    $("leaderboardList").innerHTML = entries.map((entry, index) =>
      '<div class="leaderboard-entry"><span class="rank-number">' + (index < 3 ? ["🥇","🥈","🥉"][index] : "#" + (index + 1)) +
      '</span><div><strong>' + esc(entry.display_name || "神秘玩家") + '</strong><small>' +
      Number(entry.completed_count || 0) + ' 关已完成</small></div><strong class="rank-xp">' +
      Number(entry.xp || 0) + ' XP</strong></div>'
    ).join("");
  }

  async function submitAuth(event) {
    event.preventDefault();
    if (!sb) { cloudNote("云服务尚未就绪"); return; }
    if (cloudLoading) return;
    const email = $("authEmail").value.trim();
    const password = $("authPassword").value;
    if (password.length < 8) { cloudNote("密码至少需要 8 个字符。"); return; }
    cloudLoading = true;
    $("authSubmit").disabled = true;
    try {
      let result;
      if (authMode === "signup") {
        result = await sb.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin + window.location.pathname }
        });
      } else {
        result = await sb.auth.signInWithPassword({ email, password });
      }
      if (result.error) throw result.error;
      if (authMode === "signup" && !result.data.session) {
        cloudNote("✅ 注册申请已提交！请检查邮箱的确认邮件，然后返回网站登录。");
      } else {
        cloudNote("✅ 登录成功，正在合并学习存档...");
        await handleSession(result.data.session);
      }
    } catch (error) {
      cloudNote("操作失败：" + error.message);
    } finally {
      cloudLoading = false;
      $("authSubmit").disabled = false;
    }
  }

  async function saveDisplayName() {
    if (!sb || !cloudUser) return;
    const nickname = $("displayNameInput").value.trim();
    if (!/^[\p{L}\p{N}_\-\s]{2,24}$/u.test(nickname)) {
      cloudNote("昵称须为 2–24 个字母、数字、汉字、空格、下划线或连字符。");
      return;
    }
    const { data, error } = await sb.from("profiles").update({ display_name: nickname })
      .eq("id", cloudUser.id).select("id,display_name").single();
    if (error) { cloudNote(error.message); return; }
    cloudProfile = data;
    cloudNote("排行榜昵称已更新！");
    await refreshLeaderboard();
  }

  async function logout() {
    if (!sb) return;
    await sb.auth.signOut();
    cloudUser = null;
    cloudProfile = null;
    lastAuthUser = null;
    renderCloud();
    renderLeaderboard([]);
    cloudNote("已退出云账号，本地学习进度仍保留。");
  }

  function localHint(message) {
    const day = quest.activeDay() || quest.getState().completed.length + 1 || 1;
    const challenge = findChallenge(Math.max(1, Math.min(30, day)));
    const hint = challenge ? challenge.hint : "尝试先写出输入、输出和边界条件。";
    const wording = message.includes("测试") || message.includes("错误") ?
      "建议先复现失败用例，再检查异常类型和边界情况。" :
      "先确认题目要求的函数签名，再用一个最小例子调试。";
    return "📗 本地课程提示（非 AI 生成）：\n" + hint + "\n" + wording +
      "\n如果你需要进一步推理和个性化反馈，请配置云端 AI 助教。";
  }

  function addTutorMessage(role, text) {
    const message = document.createElement("div");
    message.className = "tutor-message " + role;
    message.textContent = text;
    $("tutorMessages").appendChild(message);
    $("tutorMessages").scrollTop = $("tutorMessages").scrollHeight;
    return message;
  }

  async function askTutor(event) {
    event.preventDefault();
    if (tutorBusy) return;
    const input = $("tutorQuestion");
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    addTutorMessage("user", text);
    tutorBusy = true;
    $("tutorSubmit").disabled = true;
    const placeholder = addTutorMessage("assistant", "🤔 正在思考...");
    try {
      if (!sb || !cloudUser) {
        placeholder.textContent = localHint(text);
      } else {
        const day = quest.activeDay() || 1;
        const lesson = quest.getDays().find(item => item.day === day);
        const { data, error } = await sb.functions.invoke("ai-tutor", {
          body: {
            message: text,
            day,
            lesson: lesson ? lesson.title : "Python",
            context: lesson ? lesson.summary : ""
          }
        });
        if (error) throw error;
        if (!data || typeof data.reply !== "string") throw new Error("AI 响应格式异常");
        placeholder.textContent = data.reply;
      }
    } catch (error) {
      placeholder.textContent = "⚠️ 云端 AI 当前不可用：" + error.message + "\n\n" + localHint(text);
    } finally {
      tutorBusy = false;
      $("tutorSubmit").disabled = false;
    }
  }

  function renderTutorMode() {
    const online = sb && cloudUser;
    $("tutorMode").textContent = online ? "云端 AI · 每天有限额" : "本地课程提示";
    $("tutorDisclaimer").textContent = online ?
      "提问会发送到云端 AI 进行处理。不要输入密码、Token 或私人代码。" :
      "本地仅返回预设的课程线索，不会调用真正的语言模型。";
  }

  function bind() {
    window.addEventListener("quest:lesson-render", event => {
      if (event.detail?.tab === "mission") renderWorkbench(event.detail.day);
    });
    window.addEventListener("quest:open-cloud", openCloud);
    window.addEventListener("quest:progress-change", () => {
      if (suppressSync || !cloudUser) return;
      clearTimeout(syncDebounce);
      syncDebounce = setTimeout(() => {
        syncCloud().then(refreshLeaderboard).catch(() => {});
      }, 1000);
    });
    $("cloudButton").addEventListener("click", openCloud);
    $("closeCloud").addEventListener("click", closeCloud);
    document.querySelector("[data-close-cloud]").addEventListener("click", closeCloud);
    $("authForm").addEventListener("submit", submitAuth);
    document.querySelectorAll("[data-auth-mode]").forEach(button => {
      button.addEventListener("click", () => {
        authMode = button.dataset.authMode;
        document.querySelectorAll("[data-auth-mode]").forEach(b => b.classList.toggle("active", b === button));
        $("authSubmit").textContent = authMode === "signup" ? "创建云端账号 ☁" : "登录并同步 ☁";
      });
    });
    $("saveDisplayName").addEventListener("click", saveDisplayName);
    $("syncNow").addEventListener("click", () => syncCloud().then(refreshLeaderboard));
    $("logoutButton").addEventListener("click", logout);
    $("refreshLeaderboard").addEventListener("click", refreshLeaderboard);
    $("openTutor").addEventListener("click", () => {
      $("tutorPanel").hidden = !$("tutorPanel").hidden;
      renderTutorMode();
      if (!$("tutorPanel").hidden) $("tutorQuestion").focus();
    });
    $("closeTutor").addEventListener("click", () => { $("tutorPanel").hidden = true; });
    $("tutorForm").addEventListener("submit", askTutor);
    window.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        closeCloud();
        $("tutorPanel").hidden = true;
      }
    });
  }

  function init() {
    quest = window.PythonQuest;
    if (!quest || !challenges.length) {
      console.error("Python Quest core did not initialize.");
      return;
    }
    bind();
    renderCloud();
    renderLeaderboard([]);
    initCloud().finally(renderTutorMode);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
