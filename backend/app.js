const express = require("express")
const cors = require('cors')
const { PORT } = require("./constants.js")
const { generateGrid, getSecretCode } = require("./utils.js")

const app = express()

app.use(
    cors({
        origin: true,
        credentials: true,
    })
)

app.use(express.json())

let bias = ""
let code = 0

app.get("/grid", (req, res) => {
  const grid = generateGrid(bias)
  code = getSecretCode(grid)

  res.json(JSON.stringify(grid))
})

app.get("/code", (req, res) => {
  res.json(JSON.stringify(code))
})

app.post("/bias", (req, res) => {
  bias = req.body.bias

  res.json({})
})

app.listen(PORT, () => {
  console.log("Server running on port %s", PORT)
})
