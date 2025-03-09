import { useState, useEffect } from 'react'
import { loadPyodide } from 'pyodide'
import './App.css'

function App() {
  const [pyResult, setpyResult] = useState('')
  
  useEffect(() => {
    async function runPythonCode() {
      let pyodide = await loadPyodide()
      setpyResult(await pyodide.runPythonAsync("2**3"))
    }

    runPythonCode()
  }, [])

  return (
    <>
      <p>Result from Python: {pyResult}</p>
    </>
  )
}

export default App
