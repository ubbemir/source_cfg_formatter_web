import { loadPyodide } from "pyodide"
import grammar_string from "@source_engine_cfg_parser/source_cfg.lark?raw"
import formatters_python_string from "@source_engine_cfg_parser/src/formatters.py?raw"


let pyodide;

async function init() {
  pyodide = await loadPyodide();
  
}

self.onmessage = async (event) => {
  const { id, python, context } = event.data;
  
  try {
    const result = await pyodide.runPythonAsync(python);
    self.postMessage({ result, id });
  } catch (error) {
    self.postMessage({ error: error.message, id });
  }
};

init()

console.log(grammar_string)