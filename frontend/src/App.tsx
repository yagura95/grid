import "./App.css"
import { useEffect, useState } from "react"

async function getGrid() {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/grid`) 
  const result = await response.json()

  return JSON.parse(result)
}

function normalizeValue(count: number): number {
  if(count < 10) return count

  const n = count.toString()
  const divisor = parseInt(n[0]) + 1

  return count / divisor
}

function getSecretCode(grid: string[][]) {
  if(grid[0][0] === "") return 0 

  const seconds = new Date().getSeconds().toString().padStart(2, "0")

  const i = parseInt(seconds[0])
  const j = parseInt(seconds[1])
  
  const firstLetter: string = grid[i][j]
  const secondLetter: string = grid[j][i]

  let firstLetterCount = 0
  let secondLetterCount = 0

  grid.forEach((row: string[]) => {
    row.forEach((letter: string)=> {
      if(letter === firstLetter)  return firstLetterCount++
      if(letter === secondLetter) return secondLetterCount++
    })
  })

  firstLetterCount = normalizeValue(firstLetterCount) 
  secondLetterCount = normalizeValue(secondLetterCount) 

  return firstLetterCount * 10 + secondLetterCount
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

  useEffect(() => {
    const code = getSecretCode(grid)
    setCode(code)
  }, [grid])

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
