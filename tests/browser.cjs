/* Browser-level E2E. Requires: npm install --no-save playwright@1.65.0
 * Start a local HTTP server on port 8080 before running.
 */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

(async () => {
  const outputDir = path.resolve("test-artifacts");
  fs.mkdirSync(outputDir, { recursive: true });
  const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
  const page = await browser.newPage({ viewport: { width: 1365, height: 930 } });
  const errors = [];
  page.on("pageerror", error => errors.push(String(error)));
  try {
    await page.goto("http://127.0.0.1:8080/", { waitUntil: "domcontentloaded" });
    await page.locator("#worldMap .day-node").first().waitFor({ timeout: 20000 });
    assert.equal(await page.locator("#worldMap .day-node").count(), 30, "30 days visible");
    assert.ok((await page.locator("#heroProgressText").textContent()).includes("0%"));
    await page.screenshot({ path: path.join(outputDir, "home.png"), fullPage: true });

    await page.locator('[data-day="1"]').first().click();
    await page.locator("#lessonTitle").waitFor();
    assert.ok((await page.locator("#lessonTitle").textContent()).includes("唤醒"));
    await page.locator('[data-tab="mission"]').click();
    await page.locator("#codeEditor").waitFor();
    const code = "def make_badge(name, level):\n    return f'{name} · Lv.{level}'\n";
    await page.locator("#codeEditor").fill(code);
    await page.locator("#judgeCode").click();
    await page.locator(".result-summary.pass").waitFor({ timeout: 150000 });
    const resultText = await page.locator("#judgeOutput").textContent();
    assert.ok(resultText.includes("3 / 3"), "Judge should pass all tests");
    await page.screenshot({ path: path.join(outputDir, "challenge.png") });

    await page.locator('[data-tab="quiz"]').click();
    await page.locator('[data-answer="1"]').click();
    await page.locator("#lessonNextButton").click();
    assert.ok((await page.locator("#topXp").textContent()).includes("50 XP"), "XP granted");
    await page.locator("#closeLesson").click();

    await page.reload({ waitUntil: "domcontentloaded" });
    await page.locator("#worldMap .day-node").first().waitFor();
    assert.ok((await page.locator("#topXp").textContent()).includes("50 XP"), "XP persists");
    assert.equal(await page.locator("#worldMap .day-node.done").count(), 1);

    await page.locator("#openTutor").click();
    await page.locator("#tutorQuestion").fill("函数参数应该怎样写？");
    await page.locator("#tutorSubmit").click();
    await page.locator("#tutorMessages .tutor-message.assistant").last().waitFor();
    await page.waitForFunction(() => {
      const messages = [...document.querySelectorAll("#tutorMessages .tutor-message.assistant")];
      return messages.some(node => node.textContent.includes("本地课程提示"));
    }, null, { timeout: 15000 });

    await page.locator("#closeTutor").click();
    await page.locator("#cloudButton").click();
    await page.locator("#cloudModal.open").waitFor();
    assert.ok((await page.locator("#cloudAccountInfo").textContent()).includes("尚未配置"));
    await page.screenshot({ path: path.join(outputDir, "cloud.png") });

    assert.deepEqual(errors, [], "Unexpected page JS exceptions");
    console.log("E2E passed: map, code judge, XP persistence, offline tutor, cloud configuration.");
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exit(1); });
