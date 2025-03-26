import { loadPyodide } from "pyodide"

import grammar_string from "@source_engine_cfg_parser/source_cfg.lark?raw"
import formatters_python_string from "@source_engine_cfg_parser/src/formatters.py?raw"

async function init() {
    const pyodide = await loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.3/full/" })

    await pyodide.loadPackage("micropip")
    await pyodide.runPythonAsync("import micropip; await micropip.install('lark'); from lark import Lark")

    pyodide.FS.writeFile("/home/pyodide/formatters.py", formatters_python_string)
    pyodide.globals.set("cfg_grammar", grammar_string)
    await pyodide.runPythonAsync("cfg_parser = Lark(cfg_grammar, parser=\"earley\")")

    console.log("Pyodide Worker Initialized")
    return pyodide
}

const init_awaiters = []
function await_init(initialized) {
    return new Promise((resolve) => {
        if (initialized)
            resolve()
        else {
            init_awaiters.push(resolve)
        }
    })
}

let runtime
init().then(res => {
    runtime = res
    init_awaiters.forEach((resolve) => resolve())
})
export async function getPythonRuntime() {
    await await_init(runtime)
    return runtime
}