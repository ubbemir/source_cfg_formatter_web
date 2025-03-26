import PyodideWorker from "./worker/pyodide_worker.mjs?worker"

type FormatRequest = { cfg_input: string, prettify: boolean }
type FormatResponse = { result: string, error: string }

// Code snippet based from https://pyodide.org/en/stable/usage/webworker.html
function promiseCreator<T>() {
    let resolve!: (value: T | PromiseLike<T>) => void
    const promise = new Promise<T>(inner_res => {
        resolve = inner_res
    })
    return { promise, resolve }
}

let lastId = 1
function getId() {
    return lastId++
}


function requestResponse(worker: Worker, msg: FormatRequest) {
    const { promise, resolve } = promiseCreator<FormatResponse>()
    const idWorker = getId()
    worker.addEventListener("message", function listener(event) {
        if (event.data?.id !== idWorker) {
            return
        }
        // This listener is done so remove it.
        worker.removeEventListener("message", listener)
        // Filter the id out of the result
        const { id: _, ...rest } = event.data
        resolve(rest)
    })
    worker.postMessage({ id: idWorker, ...msg })
    return promise
}

const pyodideWorker = new PyodideWorker()

export function asyncRunCfgFormatting(cfg_input: string, prettify: boolean) {
    return requestResponse(pyodideWorker, {
        cfg_input: cfg_input,
        prettify: prettify
    })
}