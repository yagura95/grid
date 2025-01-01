const { GRID_ROWS, GRID_COLUMNS, BIAS_PERCENT } = require("./constants.js")

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

function normalizeValue(count) {
  if(count < 10) return count

  const n = count.toString()
  let divisor = parseInt(n[0]) + 1
  
  while(count % divisor !== 0) {
    divisor++
  }

  return count / divisor 
}

function getSecretCode(grid) {
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

module.exports = {
 generateRandomNumber, 
 generateRandomChar,
 generateEmptyGrid,
 generateGrid, 
 insertGridBias,
 getSecretCode
}
