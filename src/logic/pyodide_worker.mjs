import { loadPyodide } from "pyodide"
import grammar_string from "@source_engine_cfg_parser/source_cfg.lark?raw"
import formatters_python_string from "@source_engine_cfg_parser/src/formatters.py?raw"


let pyodide;

async function init() {
  pyodide = await loadPyodide({indexURL : "https://cdn.jsdelivr.net/pyodide/v0.27.3/full/"})

  await pyodide.loadPackage("micropip")
  await pyodide.runPythonAsync( "import micropip; await micropip.install('lark'); from lark import Lark" )

  pyodide.FS.writeFile("/home/pyodide/formatters.py", formatters_python_string)
  pyodide.globals.set("cfg_grammar", grammar_string)
  await pyodide.runPythonAsync('cfg_parser = Lark(cfg_grammar, parser="earley")')

  pyodide.globals.set("input_content", "sv_cheats 1; mp_restartgame 1")
  console.log(await pyodide.runPythonAsync("import formatters; formatters.prettify_cfg(cfg_parser.parse(input_content))"))
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