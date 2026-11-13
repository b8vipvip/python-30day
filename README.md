# 🐍 Python Quest v2 · 30 天冒险学院

把 Python 学习玩成一场冒险：30 天任务地图、浏览器 Python 运行、自动判题、AI 助教、等级徽章、排行榜和跨设备存档。

**网站**：https://b8vipvip.github.io/python-30day/

## 功能状态

| 功能 | 是否需要云端配置 | 说明 |
|---|---|---|
| 30 关四大陆地图 | 不需要 | 知识、任务、徽章、Boss、XP、专注计时 |
| Python 在线运行 | 不需要 | Pyodide v314.0.7，首次需联网加载 WebAssembly |
| 自动判题 | 不需要 | 每关内置 2–4 项 Python 断言测试 |
| AI 助教 | 需要 | Supabase Edge Function + OpenAI Responses API |
| 本地课程提示 | 不需要 | **规则提示而非 AI 模型** |
| 账号和跨设备同步 | 需要 | Supabase Auth + Postgres + RLS |
| 真实玩家排行榜 | 需要 | 按自报学习进度排名，不展示虚构玩家 |

**重要**：浏览器端的自动判题不能作为防作弊的可信证明。排行榜仅用于学习激励，成绩来自客户端提交的学习记录，不适用于带奖品的竞赛。代码草稿只保存在当前浏览器，云端同步的是完成天数、练习记录和相关成就依据。

## 本地开发

这是零构建 HTML / CSS / JavaScript 静态网站。

~~~bash
git clone https://github.com/b8vipvip/python-30day.git
cd python-30day
python -m http.server 8080
~~~

访问 http://localhost:8080 。模块 Web Worker 不推荐通过 file:// 直接打开。首次运行 Python 需要从 CDN 下载运行时。

## 部署到 GitHub Pages

进入 GitHub 仓库 Settings → Pages → Build and deployment，选择 GitHub Actions。每次推送到 main 会执行自动检查并部署到 https://b8vipvip.github.io/python-30day/ 。

## 开启 Supabase 云账号、同步和排行榜

1. 访问 https://supabase.com/dashboard 创建项目。
2. 打开 SQL Editor，执行仓库中的 supabase/schema.sql。
3. 在 Authentication → Providers 启用 Email，并建议保留邮件验证及注册限流。
4. 在 Authentication → URL Configuration 设置 Site URL 和 Redirect URLs 为 https://b8vipvip.github.io/python-30day/ 。本地开发可以另加 http://localhost:8080/ 。
5. 修改仓库根目录 config.js，只填写项目 URL 和 **可公开的 publishable key**。

~~~js
window.PYTHON_QUEST_CONFIG = Object.freeze({
  supabaseUrl: "https://YOUR-PROJECT.supabase.co",
  supabasePublishableKey: "sb_publishable_YOUR_PUBLIC_KEY"
});
~~~

不要把 OpenAI API Key、Supabase secret/service_role 密钥提交到 GitHub 或放在静态网页里。

数据库脚本创建 profiles（个人昵称）、progress（私有学习记录）、tutor_usage（每日配额）以及 merge_my_progress、top_learners、consume_tutor_quota 三个安全受控 RPC。RLS 限制用户只能查询自己的私有记录。登录后，程序原子合并本地与云端完成天数，不会因跨设备进度不同而倒退；XP 由完成关卡推导，而不采用客户端提交的 XP 数字。

## 启用真正的 AI 学习助教

AI 助教服务端代码位于 supabase/functions/ai-tutor/index.ts。需要先配置 Supabase CLI：

~~~bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
~~~

在 Supabase Dashboard 的 Edge Function Secrets 中配置：

- OPENAI_API_KEY：服务端 OpenAI API 密钥。
- OPENAI_MODEL：你实际可调用的 Responses API 模型，默认 gpt-5-mini。
- SUPABASE_PUBLISHABLE_KEY：Supabase 项目的公开 key。
- ALLOWED_ORIGINS：例如 https://b8vipvip.github.io,http://localhost:8080 。

SUPABASE_URL 通常由平台自动注入。密钥必须留在 Supabase 服务端，不能添加到前端 config.js 或提交到代码仓库。

部署：

~~~bash
supabase functions deploy ai-tutor
~~~

supabase/config.toml 为函数设置了 verify_jwt = false，以兼容新的 publishable key；**函数内部仍验证用户的 Supabase Auth JWT**，未登录用户无法调用 AI。数据库原子限制每个账号每天最多 20 次 AI 调用。建议另外在 OpenAI 项目中设置用量预算，并在 Supabase Auth 启用合适的防注册滥用措施。用户主动输入的提问会发送到配置的 AI 服务商；系统不会自动上传编辑器中的代码。API 请求设置 store: false。

如果不配置上述服务，网站仍可使用；聊天窗口明确显示“本地课程提示”，不会冒充真实 AI。

## 30 天课程地图

| 世界 | 关卡 | 学习方向 |
|---|---|---|
| 🌲 Python 森林 | Day 1–7 | 语法、数据结构、函数、异常、生成器、装饰器 |
| 🏰 API 城堡 | Day 8–14 | FastAPI、Pydantic、SQLAlchemy、HTTPX、asyncio |
| 🧪 Debug 深渊 | Day 15–21 | Pytest、Mock、集成测试、并发、Debug、安全 |
| 🚀 交付者群岛 | Day 22–30 | Docker、可靠性、代码审核和工程毕业项目 |

每关的在线编程挑战是**纯 Python 小练习**。FastAPI、数据库、Docker/Kubernetes 和完整工程项目仍须按课程任务在本地 IDE 实作；浏览器中的微型挑战不能替代完整交付验收。

## 安全和隐私

- Python 执行位于浏览器 Web Worker 中，每次运行使用独立命名空间；超时后停止线程。
- 运行器设有代码大小、日志长度和时间限制；但 Web Worker + Pyodide **不是安全隔离沙箱**。请只运行自己编写的可信代码，不要执行来路不明的代码。
- 要安全执行不可信第三方代码，必须部署专门的服务端隔离容器或微虚拟机，使用最小权限、隔离网络、CPU/内存/进程限制和超时保护。当前版本不包含该能力。
- 云端存储进度而不是代码文本；排行榜只显示昵称、完成数量和 XP，不显示邮箱。
- AI 密钥仅在 Supabase Edge Function 环境中保存；如要对公众开放，请另外设置供应商花费上限。

## 自动化测试

~~~bash
node --check app.js
node --check challenges.js
node --check platform.js
node --check python-worker.mjs
node tests/smoke.cjs
~~~

GitHub Actions 在部署前验证静态文件、脚本语法、30 天课程和 30 份 Python 练习代码及测试断言的语法。

## 项目结构

~~~text
index.html
styles.css
app.js
challenges.js
platform.js
python-worker.mjs
config.js
favicon.svg
tests/smoke.cjs
supabase/schema.sql
supabase/config.toml
supabase/functions/ai-tutor/index.ts
.github/workflows/deploy.yml
~~~

## 尚待强化

- 真正可信的服务端判题、反作弊和获奖排行榜；
- 更多自动化评分维度、代码质量与安全测试；
- 云端代码草稿同步（当前仅同步学习进度）；
- 浏览器端完整 E2E 测试和真实设备兼容性测试。

未接入实际 Supabase 项目和服务端 API Key 前，不能声称 AI 助教或跨设备同步已经对公众启用。
