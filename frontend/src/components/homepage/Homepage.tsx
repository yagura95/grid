import "./Homepage.css"
import { useState } from "react"
import { setBias, getGrid, getSecretCode } from "../../services.tsx"
import { generateEmptyGrid } from "../../utils.tsx"

import Header from "./Header.tsx"
import Grid from "./Grid.tsx"
import SecretCode from "./SecretCode.tsx"

function Homepage() {
  const [grid, setGrid] = useState<string[][]>(generateEmptyGrid())
  const [char, setChar] = useState<string>("")
  const [code, setCode] = useState<number>(0)

  async function generateGrid() {
    const newGrid = await getGrid()
    const newCode = await getSecretCode() 

    setGrid(newGrid)
    setCode(newCode)
  }

  function generate() {
    generateGrid()

    setInterval(() => {
      generateGrid()
    }, 2000)
  }

  function updateChar(e) {
    const value = e.target.value

    if(!value.match("[a-z ]")) return setChar("")

    setChar(value) 
    setBias(value)

    e.target.disabled = true

    setTimeout(() => {
      e.target.disabled = false
    }, 4000)
  }

  return <div className="container">
    <Header char={char} generate={generate} updateChar={updateChar} />
    <Grid grid={grid} />
    <SecretCode code={code} />
  </div>
}

export default Homepage 
