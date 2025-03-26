import { useState, useEffect } from "react"
import * as pyodide_worker_api from "./logic/pyodide_worker_api"

import "./App.css"
import "./Spinner.css"

function App() {
  const [pyResult, setPyResult] = useState("")
  const [pyReady, setpyReady] = useState(false)
  const [inputCfg, setInputCfg] = useState("")
  const [shouldMinify, setShouldMinify] = useState(false)

  useEffect(() => {
    const updateFormatting = async () => {
      const shouldPrettify = !shouldMinify // as prettifying is the opposite of minifying
      const { result, error } = await pyodide_worker_api.asyncRunCfgFormatting(inputCfg, shouldPrettify)
      if (result) {
        setPyResult(result)
      } else if (error) {
        setPyResult("ERROR parsing, INVALID INPUT. Check console for more information.")
        console.error(error)
      }
    }

    if (pyReady) {
      updateFormatting()
    }
  }, [inputCfg, shouldMinify, pyReady])


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
      <header>
        <h1>Source CFG Formatter</h1>
        <strong>by <a href="https://github.com/ubbemir">ubbemir</a></strong>

        <p>
          This project uses my Python <a href='https://github.com/ubbemir/source_engine_cfg_parser'>library</a> for parsing and formatting. 
          If you encounter any incorrectly flagged parsing errors for valid input, please report them to that repository.
        </p>
      </header>
      <div className="content">
        <Spinner className="spinner-container" ready={pyReady} />
        <label>
          <input
            type="checkbox"
            checked={shouldMinify}
            onChange={_ => setShouldMinify(!shouldMinify)}
          />
          Minify
        </label>
        <div className="text-areas">
          <div>
            <span>Input</span>
            <textarea rows={15} cols={80} value={inputCfg} onChange={e => setInputCfg(e.target.value)} disabled={!pyReady} placeholder="Input CFG"></textarea>
          </div>
          <div>
            <span>Output</span>
            <textarea rows={15} cols={80} value={pyResult} disabled={!pyReady} readOnly></textarea>
          </div>
        </div>
      </div>
    </>
  )
}

function Spinner({ ready, className }: { ready: boolean, className: string }) {
  if (ready) {
    return <></>
  }

  return (
    <div className={className}><span>Initializing Python runtime... </span><div className="spinner"></div></div>
  )
}

export default App
