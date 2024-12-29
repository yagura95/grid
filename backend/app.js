const express = require("express")
const cors = require('cors')

const PORT = 4000
const GRID_COLUMNS = 10
const GRID_ROWS = 10
const BIAS_PERCENT = 0.2

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function generateRandomChar() {
  const min = 97  // ascii lowercase a 
  const max = 122 // ascii lowercase z

  return String.fromCharCode(generateRandomNumber(min, max))
}

function generateEmptyGrid(numRows, numColumns) {
  const grid = [] 

  for(let i = 0; i < numRows; i++) {
    grid.push(new Array(numColumns).fill("")) 
  }

  return grid
}

function insertGridBias(grid, bias) {
  let biasCount = GRID_ROWS * GRID_COLUMNS * BIAS_PERCENT 

  while(biasCount > 0) {
    const row = generateRandomNumber(0, GRID_ROWS - 1) 
    const col = generateRandomNumber(0, GRID_COLUMNS - 1) 

    if(!grid[row][col]) {
      grid[row][col] = bias
      biasCount--
    } 
  }
}

function generateGrid(bias) {
  const grid = generateEmptyGrid(GRID_ROWS, GRID_COLUMNS)

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

const app = express()

app.use(
    cors({
        origin: true,
        credentials: true,
    })
)

app.use(express.json())

let bias = ""

app.get("/grid", (req, res) => {
  const grid = generateGrid(bias)

  res.json(JSON.stringify(grid))
})

app.post("/bias", (req, res) => {
  bias = req.body.bias

  console.log(bias)
  res.json({})
})

app.listen(PORT, () => {
  console.log("Server running on port %s", PORT)
})
