import { useState, useEffect } from "react"
import { loadPyodide } from "pyodide"
import "./App.css"

async function init_python() {
  return await loadPyodide()
}

function App() {
  const [pyResult, setpyResult] = useState("")
  
  useEffect(() => {
    let pyodide: any //eslint-disable-line @typescript-eslint/no-explicit-any

    async function runPythonCode() {
      setpyResult(await pyodide.runPythonAsync("2**3"))
    }

    async function init() {
      pyodide = await init_python()

      if (pyodide)
        await runPythonCode()
    }

    init()
  }, [])

  return (
    <>
      <p>Result from Python: {pyResult}</p>
    </>
  )
}

export default App
