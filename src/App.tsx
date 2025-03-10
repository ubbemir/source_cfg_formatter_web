import { useState, useEffect } from "react"
import * as formatting from "./logic/formatting"

function App() {
  const [pyResult, ] = useState("")
  const [formatterStatus, setFormatterStatus] = useState("initializing")
  
  useEffect(() => {
    formatting.init()
    setFormatterStatus("done")
  }, [])

  return (
    <>
      <p>{formatterStatus}</p>
      <p>Result from Python: {pyResult}</p>
    </>
  )
}

export default App
