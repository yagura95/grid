import "./App.css"
import { useState } from "react"

async function getGrid() {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/grid`) 
  const result = await response.json()

  return JSON.parse(result)
}

const emptyGrid: string[][] = new Array(10).fill(new Array(10).fill(""))

function App() {
  const [grid, setGrid] = useState<string[][]>(emptyGrid)
  const [char, setChar] = useState<string>("")
  const [code, setCode] = useState<number>(0)
  
  async function generateGrid() {
    setGrid(await getGrid())

    setInterval(async () => {
      setGrid(await getGrid())
    }, 2000)
  }

  function verifyChar() {}

  return <div className="container">
    <header>
      <div className="header-item">
        <label htmlFor="char">CHARACTER</label>
        <input maxLength={1} pattern="[a-z]" placeholder="Character" name="char" type="text" onChange={verifyChar} />
      </div>
      <div className="header-item">
        <img alt="clock" id="clock" src="/clock.svg" />
      </div>
      <div className="header-item">
        <button onPointerUp={generateGrid}>GENERATE 2D GRID</button>
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
        <div id="code">Your code: <span>{code}</span></div>
      </div>
    </div>
  </div>
}

export default App
