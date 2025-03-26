import { getPythonRuntime } from "./runtime"


self.onmessage = async (event) => {
    const { id, cfg_input, prettify } = event.data

    const runtime = await getPythonRuntime()

    try {
        runtime.globals.set("input_content", cfg_input)
        let result
        if (prettify)
            result = await runtime.runPythonAsync("import formatters; formatters.prettify_cfg(cfg_parser.parse(input_content))")
        else
            result = await runtime.runPythonAsync("import formatters; formatters.minify_cfg(cfg_parser.parse(input_content))")

        self.postMessage({ result, id })
    } catch (error) {
        self.postMessage({ error: error.message, id })
    }
}