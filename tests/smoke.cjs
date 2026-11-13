/* Basic deterministic checks for course data and static app wiring.
 * Run with: node tests/smoke.cjs
 */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const { spawnSync } = require("node:child_process");

const root = process.cwd();
const html = fs.readFileSync(root + "/index.html", "utf8");
const app = fs.readFileSync(root + "/app.js", "utf8");
const platform = fs.readFileSync(root + "/platform.js", "utf8");
const worker = fs.readFileSync(root + "/python-worker.mjs", "utf8");

for (const path of ["config.js","challenges.js","app.js","platform.js","styles.css","python-worker.mjs"]) {
  assert.ok(html.includes(path) || path === "python-worker.mjs",
    "App should reference " + path);
}
for (const id of ["lessonModal","codingWorkbench","cloudModal","tutorPanel","leaderboardList","worldMap"]) {
  assert.ok((html + app + platform).includes(id), "Missing UI anchor " + id);
}
assert.ok(worker.includes("loadPyodide"), "Pyodide integration missing");
assert.ok(worker.includes("<learner.py>"), "Python code execution missing");

const context = { window: {} };
vm.runInNewContext(fs.readFileSync(root + "/challenges.js", "utf8"), context);
const challenges = context.window.QuestChallenges;
assert.equal(challenges.length, 30, "Must supply exactly 30 coding challenges");
assert.equal(new Set(challenges.map(c => c.day)).size, 30, "Day numbers must be unique");
for (let day = 1; day <= 30; day += 1) {
  const challenge = challenges.find(c => c.day === day);
  assert.ok(challenge, "Missing Day " + day);
  assert.ok(challenge.starter.includes("def ") || challenge.starter.includes("async def "));
  assert.ok(challenge.tests.length >= 2, "Need at least two tests for Day " + day);
  for (const test of challenge.tests) {
    assert.equal(test.length, 2, "Test must be (label, Python code)");
    assert.ok(test[0] && test[1], "Test entries cannot be empty");
  }
}
const py = String.raw`import ast, json, sys, textwrap
rows=json.load(sys.stdin)
for row in rows:
    ast.parse(row["starter"], filename=f'Day{row["day"]}-starter.py')
    for name, test in row["tests"]:
        ast.parse("async def check():\n" + textwrap.indent(test, "    "))
print("Python syntax validated for 30 starters and " + str(sum(len(c["tests"]) for c in rows)) + " assertions")
`;
const check = spawnSync("python3", ["-c", py], {
  input: JSON.stringify(challenges), encoding: "utf8"
});
assert.equal(check.status, 0, check.stderr || "Python syntax validation failed");
console.log(check.stdout.trim());
console.log("Smoke checks passed: modules wired, 30 challenges, judge worker present.");
