import PyodideWorker from "./pyodide_worker.mjs?worker"

// Code snippet from https://pyodide.org/en/stable/usage/webworker.html
function getPromiseAndResolve() {
    let resolve;
    let promise = new Promise((res) => {
        resolve = res;
    });
    return { promise, resolve };
}

let lastId = 1;
function getId() {
    return lastId++;
}


function requestResponse(worker, msg) {
    const { promise, resolve } = getPromiseAndResolve();
    const idWorker = getId();
    worker.addEventListener("message", function listener(event) {
        if (event.data?.id !== idWorker) {
            return;
        }
        // This listener is done so remove it.
        worker.removeEventListener("message", listener);
        // Filter the id out of the result
        const { id, ...rest } = event.data;
        resolve(rest);
    });
    worker.postMessage({ id: idWorker, ...msg });
    return promise;
}

const pyodideWorker = new PyodideWorker()

export function asyncRunCfgFormatting(cfg_input, prettify) {
    return requestResponse(pyodideWorker, {
        cfg_input: cfg_input,
        prettify: prettify
    });
}