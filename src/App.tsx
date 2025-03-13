import { useState, useEffect } from "react"
import * as pyodide_worker_api from "./logic/pyodide_worker_api.mjs"

import "./App.css"

function App() {
  const [pyResult, setPyResult] = useState("")
  const [pyReady, setpyReady] = useState(false)
  const [inputCfg, setInputCfg] = useState("")
  
  const inputChanged = async (e: any) => {
    const input = e.target.value
    setInputCfg(input)

    if (pyReady) {
      const { result, error } = await pyodide_worker_api.asyncRunCfgFormatting(input, true)
      if (result)
        setPyResult(result)
      else
        console.log(error)
    }
  }

  useEffect(() => {
    const load_formatters = async () => {
      const { result, error } = await pyodide_worker_api.asyncRunCfgFormatting("sv_cheats 1", true)
      if (result)
        setpyReady(true)
      else
        console.log(error)
    }

    
    load_formatters()
  }, [])

  return (
    <>
      <p>{pyReady ? "Done" : "Initializing"}</p>
      <textarea rows={15} cols={80} value={inputCfg} onInput={inputChanged} disabled={!pyReady} placeholder="Input CFG"></textarea>
      <textarea rows={15} cols={80} value={pyResult} readOnly></textarea>
    </>
  )
}

export default App
