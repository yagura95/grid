import { Grid } from "./interface.ts"

const GRID_ROWS: number = parseInt(process.env.GRID_ROWS!)
const GRID_COLUMNS: number = parseInt(process.env.GRID_COLUMNS!)
const BIAS_PERCENT: number = parseInt(process.env.BIAS_PERCENT!)

function generateRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function generateRandomChar(): string {
  const min = 97  // ascii lowercase a 
  const max = 122 // ascii lowercase z

  return String.fromCharCode(generateRandomNumber(min, max))
}

export function generateEmptyGrid(): Grid {
  const grid = [] 

  for(let i = 0; i < GRID_ROWS; i++) {
    grid.push(new Array(GRID_COLUMNS).fill("")) 
  }

  return grid
}

function insertGridBias(grid: Grid, bias: string): void {
  let biasCount: number = GRID_ROWS * GRID_COLUMNS * BIAS_PERCENT

  while(biasCount > 0) {
    const row = generateRandomNumber(0, GRID_ROWS - 1) 
    const col = generateRandomNumber(0, GRID_COLUMNS - 1) 

    if(!grid[row][col]) {
      grid[row][col] = bias
      biasCount--
    } 
  }
}

export function generateGrid(bias: string): Grid {
  const grid = generateEmptyGrid()

  if(bias) {
    insertGridBias(grid, bias)
  }

  for(let row = 0; row < GRID_ROWS; row++) {
    for(let col = 0; col < GRID_COLUMNS; col++) {
      if(grid[row][col]) continue 

      let char = generateRandomChar()

      while(char === bias) {
        char = generateRandomChar()
      }

      grid[row][col] = char
    }
  }

  return grid
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

export function getSecretCode(grid: Grid): number {
  if(grid[0][0] === "") return 0 

  const seconds = new Date().getSeconds().toString().padStart(2, "0")

  const i = parseInt(seconds[0])
  const j = parseInt(seconds[1])
  
  const firstLetter = grid[i][j]
  const secondLetter = grid[j][i]

  let firstLetterCount = 0
  let secondLetterCount = 0

  grid.forEach((row) => {
    row.forEach((letter)=> {
      if(letter === firstLetter)  return firstLetterCount++
      if(letter === secondLetter) return secondLetterCount++
    })
  })

  firstLetterCount = normalizeValue(firstLetterCount) 
  secondLetterCount = normalizeValue(secondLetterCount) 

  return firstLetterCount * 10 + secondLetterCount
}
