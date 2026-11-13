/* Browser-only Python runner. Not a security sandbox for hostile code.
 * Learner-owned snippets run in a Web Worker; main thread imposes timeouts.
 */
import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v314.0.7/full/pyodide.mjs";

let pyodidePromise = null;
function getPyodide() {
  if (!pyodidePromise) pyodidePromise = loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v314.0.7/full/" });
  return pyodidePromise;
}

const PYTHON_RUNNER = "import contextlib\nimport io\nimport json\nimport textwrap\nimport traceback\n\n__quest_data = json.loads(__quest_payload)\n__quest_env = {\"__name__\": \"__main__\"}\n__quest_stdout = io.StringIO()\n__quest_stderr = io.StringIO()\n__quest_results = []\n__quest_error = \"\"\n__quest_compile_ok = True\n\nasync def __quest_execute():\n    global __quest_compile_ok, __quest_error\n    with contextlib.redirect_stdout(__quest_stdout), contextlib.redirect_stderr(__quest_stderr):\n        try:\n            exec(compile(__quest_data[\"code\"], \"<learner.py>\", \"exec\"), __quest_env)\n        except BaseException:\n            __quest_compile_ok = False\n            __quest_error = traceback.format_exc(limit=8)\n\n        if __quest_compile_ok and __quest_data.get(\"mode\") == \"judge\":\n            for label, script in __quest_data[\"tests\"]:\n                try:\n                    test_src = \"async def __quest_check():\\n\" + textwrap.indent(script, \"    \")\n                    exec(compile(test_src, \"<check.py>\", \"exec\"), __quest_env)\n                    await __quest_env[\"__quest_check\"]()\n                    __quest_results.append({\"label\": label, \"passed\": True, \"error\": \"\"})\n                except BaseException:\n                    __quest_results.append({\n                        \"label\": label,\n                        \"passed\": False,\n                        \"error\": traceback.format_exc(limit=4)[-900:]\n                    })\n\nawait __quest_execute()\njson.dumps({\n    \"ok\": __quest_compile_ok and (not __quest_data.get(\"mode\") == \"judge\" or all(item[\"passed\"] for item in __quest_results)),\n    \"stdout\": __quest_stdout.getvalue()[:8192],\n    \"stderr\": __quest_stderr.getvalue()[:4096],\n    \"error\": __quest_error[-2000:],\n    \"tests\": __quest_results\n}, ensure_ascii=False)";

self.postMessage({ type: "starting" });
getPyodide().then(() => self.postMessage({ type: "ready" }))
  .catch(error => self.postMessage({ type: "fatal", error: String(error) }));

self.onmessage = async event => {
  const { id, code, mode, tests } = event.data || {};
  if (!Number.isSafeInteger(id) || typeof code !== "string") return;
  if (code.length > 24000) {
    self.postMessage({ id, type: "result", data: { ok: false, error: "代码超过 24KB 上限", tests: [] } });
    return;
  }
  try {
    const pyodide = await getPyodide();
    pyodide.globals.set("__quest_payload", JSON.stringify({
      code,
      mode: mode === "judge" ? "judge" : "run",
      tests: Array.isArray(tests) ? tests : []
    }));
    const raw = await pyodide.runPythonAsync(PYTHON_RUNNER);
    self.postMessage({ id, type: "result", data: JSON.parse(raw) });
  } catch (error) {
    self.postMessage({
      id, type: "result",
      data: { ok: false, stdout: "", stderr: "", error: String(error).slice(0, 2000), tests: [] }
    });
  }
};
