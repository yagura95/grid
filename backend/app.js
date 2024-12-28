const express = require("express")
const cors = require('cors')

const app = express()
app.use(
    cors({
        origin: true,
        credentials: true,
    })
)

// Constants
const PORT = 4000
const GRID_COLUMNS = 10
const GRID_ROWS = 10

function generateRandomChar() {
  const max = 122 // ascii lowercase z
  const min = 97  // ascii lowercase a 

  return String.fromCharCode(Math.floor(Math.random() * (max - min + 1) + min))
}

function generateGrid(rows, columns) {
  const grid = [] 

  for(let i = 0; i < rows; i++) {
    const row = []
    for(let j = 0; j < columns; j++) {
      row.push(generateRandomChar()) 
    }

    grid.push(row)
  }

  return grid
}

app.get("/grid", (req, res) => {
  const grid = generateGrid(GRID_ROWS, GRID_COLUMNS)

  res.json(JSON.stringify(grid))
})

app.listen(PORT, () => {
  console.log("Server running on port %s", PORT)
})
