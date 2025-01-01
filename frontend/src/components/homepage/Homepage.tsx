import "./Homepage.css"
import { useState, useEffect } from "react"
import { socket } from "../../services/socket.ts"
import { setBias, startGenerator } from "../../services.tsx"
import { generateEmptyGrid } from "../../utils.tsx"

import Header from "./Header.tsx"
import Grid from "./Grid.tsx"
import SecretCode from "./SecretCode.tsx"

function Homepage() {
  const [grid, setGrid] = useState<string[][]>(generateEmptyGrid())
  const [char, setChar] = useState<string>("")
  const [code, setCode] = useState<number>(0)

  function updateChar(e: any) {
    const value = e.target.value

    if(!value.match("[a-z ]")) return setChar("")

    setChar(value) 
    setBias(value)

    e.target.disabled = true

    setTimeout(() => {
      e.target.disabled = false
    }, 4000)
  }

  useEffect(() => {
    socket.emit("GENERATOR_CHECK")

    socket.on("GENERATOR_START", ({ grid, code, bias }) => {
      setGrid(grid)
      setCode(code)
      setChar(bias)
    })

    socket.on("NEW_GRID", ({ grid, code, bias }) => {
      setGrid(grid)
      setCode(code)
      setChar(bias)
    })

    socket.on("NEW_BIAS", ({ bias }) => {
      setChar(bias)
    })
    
    return () => {
      socket.off("GENERATOR_START")
      socket.off("NEW_GRID")
      socket.off("NEW_BIAS")
    }
  }, [])

  return <div className="container">
    <Header char={char} generate={startGenerator} updateChar={updateChar} />
    <Grid grid={grid} />
    <SecretCode code={code} />
  </div>
}

export default Homepage 