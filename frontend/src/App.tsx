import "./App.css"
import { useState } from "react"

async function setBias(bias: string) {
  try {
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/bias`, {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({ bias })
    }) 

  } catch(e) {
    console.error(e)
  }
}

async function getGrid() {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/grid`) 
    const result = await response.json()

    return JSON.parse(result)
  } catch(e) {
    console.error(e)
    return generateEmptyGrid()
  }
}

function normalizeValue(count: number): number {
  if(count < 10) return count

  const n = count.toString()
  let divisor = parseInt(n[0]) + 1
  
  while(count % divisor !== 0) {
    divisor++
  }

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

function generateEmptyGrid(): string[][] {
  return new Array(10).fill(new Array(10).fill(""))
}

function App() {
  const [grid, setGrid] = useState<string[][]>(generateEmptyGrid())
  const [char, setChar] = useState<string>("")
  const [code, setCode] = useState<number>(0)

  async function generateGrid() {
    const newGrid = await getGrid()
    const newCode = getSecretCode(newGrid)

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
