import "./App.css"
import { useState } from "react"
import { setBias, getGrid, getSecretCode } from "./services.tsx"
import { generateEmptyGrid } from "./utils.tsx"

function App() {
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
    <header>
      <div className="header-item">
        <label id="secret-code-label" htmlFor="char">CHARACTER</label>
        <input id="secret-code-input" maxLength={1} placeholder="Character" name="char" type="text" onChange={updateChar} value={char}/>
      </div>
      <div className="header-item">
        <img alt="clock" id="clock" src="/clock.svg" />
      </div>
      <div className="header-item">
        <button id="generate-btn" onPointerUp={generate}>GENERATE 2D GRID</button>
      </div>
    </header>

    <div className="grid">
      {grid.map((row) => {
        return row.map((letter, i) => {
          return <div key={i} className="grid-item">{letter}</div> 
        })
      })}
    </div>

    <div className="code-secret-container">
      <div id="live">
        <div id="red-ball"/>
        LIVE 
      </div>
      <div className="code-secret">
        <div id="code">YOUR CODE: <span>{code}</span></div>
      </div>
    </div>
  </div>
}

export default App
