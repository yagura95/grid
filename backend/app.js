const express = require("express")
const cors = require('cors')
const { PORT } = require("./constants.js")
const { generateGrid, generateEmptyGrid, getSecretCode } = require("./utils.js")

const app = express()

app.use(
    cors({
        origin: true,
        credentials: true,
    })
)

app.use(express.json())

const payments = []
let grid = generateEmptyGrid() 
let bias = ""
let code = 0
let generatorInterval = 0

app.get("/generator", (req, res) => {
  clearInterval(generatorInterval)  

  grid = generateGrid(bias)
  code = getSecretCode(grid)

  generatorInterval = setInterval(() => {
    grid = generateGrid(bias)
    code = getSecretCode(grid)
  }, 2000)

  res.json(JSON.stringify(grid))
})

app.get("/grid", (req, res) => {
  res.json(JSON.stringify(grid))
})

app.get("/code", (req, res) => {
  res.json(JSON.stringify(code))
})

app.post("/bias", (req, res) => {
  bias = req.body.bias

  res.json({})
})

app.post("/payment", (req, res) => {
  const { payment, amount } = req.body 

  const newPayment = {
    payment,
    amount,
    grid,
    code
  }

  payments.push(newPayment)

  res.json(JSON.stringify(newPayment))
})

app.get("/payments", (req, res) => {
  res.json(JSON.stringify(payments))
})

app.listen(PORT, () => {
  console.log("Server running on port %s", PORT)
})
