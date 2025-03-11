import { loadPyodide } from "pyodide"
import grammar_string from "@source_engine_cfg_parser/source_cfg.lark?raw"
import formatters_python_string from "@source_engine_cfg_parser/src/formatters.py?raw"


let pyodide

const init_awaiters = []
let initialized = false
async function init() {
  pyodide = await loadPyodide({indexURL : "https://cdn.jsdelivr.net/pyodide/v0.27.3/full/"})

  await pyodide.loadPackage("micropip")
  await pyodide.runPythonAsync( "import micropip; await micropip.install('lark'); from lark import Lark" )

  pyodide.FS.writeFile("/home/pyodide/formatters.py", formatters_python_string)
  pyodide.globals.set("cfg_grammar", grammar_string)
  await pyodide.runPythonAsync("cfg_parser = Lark(cfg_grammar, parser=\"earley\")")

  initialized = true
  init_awaiters.forEach((resolve) => resolve())
  console.log("Pyodide Worker Initialized")
}

function await_init() {
  return new Promise((resolve) => {
    if (initialized)
      resolve()
    else
    {
      init_awaiters.push(resolve)
    }
  })
}

// Code snippet from https://pyodide.org/en/stable/usage/webworker.html
self.onmessage = async (event) => {
  const { id, cfg_input, prettify } = event.data
  
  await await_init()

  try {
    pyodide.globals.set("input_content", cfg_input)
    let result
    if (prettify)
      result = await pyodide.runPythonAsync("import formatters; formatters.prettify_cfg(cfg_parser.parse(input_content))")
    else
      result = await pyodide.runPythonAsync("import formatters; formatters.minify_cfg(cfg_parser.parse(input_content))")

    self.postMessage({ result, id })
  } catch (error) {
    self.postMessage({ error: error.message, id })
  }
}

init()