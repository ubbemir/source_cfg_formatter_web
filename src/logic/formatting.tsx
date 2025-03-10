import PyodideWorker from "./pyodide_worker.mjs?worker"


async function init_python() {
    new PyodideWorker()
}

export async function init() {
    await init_python()
}