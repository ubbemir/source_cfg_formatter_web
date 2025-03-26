import rt from "./runtime.mjs"


self.onmessage = async (event) => {
    const { id, cfg_input, prettify } = event.data

    const runtime = await rt.getRuntime()

    try {
        runtime.globals.set("input_content", cfg_input)
        let result
        if (prettify)
            result = await runtime.runPythonAsync("formatters.prettify_cfg(cfg_parser.parse(input_content))")
        else
            result = await runtime.runPythonAsync("formatters.minify_cfg(cfg_parser.parse(input_content))")

        self.postMessage({ result, id })
    } catch (error) {
        let errorMessage = "Unknown error"
        if (error instanceof Error) {
            errorMessage = error.message
        }

        self.postMessage({ error: errorMessage, id })
    }
}