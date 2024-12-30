const express = require("express")
const cors = require('cors')
const { PORT, TOKEN } = require("./constants.js")
const { createServer } = require("http")
const { Server } = require("socket.io")
const { generateGrid, generateEmptyGrid, getSecretCode } = require("./utils.js")

const app = express()
app.use(
    cors({
        origin: true,
        credentials: true,
    })
)

app.use(express.json())

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: true });

io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
        return next(new Error('Authentication token required'));
    }

    try {
        // Validation logic
        // Not a normal/correct way to it, but since there is no login panel
        // this was a simple way to show I can implement it 
        if(token !== TOKEN) new Error("Invalid token")
        next();
    } catch (err) {
        next(new Error('Invalid token'));
    }
});

const payments = []
let grid = generateEmptyGrid() 
let bias = ""
let code = 0
let generatorTimeout = 0

function generate() {
  grid = generateGrid(bias)
  code = getSecretCode(grid)
  io.emit("NEW_GRID", { grid, code, bias })

  generatorTimeout = setTimeout(() => {
    generate()
  }, 2000) 
}

io.on('connection', (socket) => {
    console.log(`User ${socket.id} connected`); 

    socket.on("GENERATOR_CHECK", () => {
      if(!generatorTimeout) return 

      socket.emit("GENERATOR_START", { grid, code, bias })
    })

    socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected`);
    });
});

app.get("/generator", (req, res) => {
  if(generatorTimeout) return res.json({})

  generate()
  res.json({})
})

app.get("/grid", (req, res) => {
  res.json(JSON.stringify(grid))
})

app.get("/code", (req, res) => {
  res.json(JSON.stringify(code))
})

app.post("/bias", (req, res) => {
  bias = req.body.bias
  io.emit("NEW_BIAS", { bias })
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

  io.emit("NEW_PAYMENT", payments)
  res.json(JSON.stringify(newPayment))
})

app.get("/payments", (req, res) => {
  res.json(JSON.stringify(payments))
})

httpServer.listen(PORT, () => {
  console.log("Server running on port %s", PORT)
})
