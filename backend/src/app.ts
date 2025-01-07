import dotenv from 'dotenv'
dotenv.config();
import express, { Express, Request, Response } from "express"
import { Payment } from "./types"
import cors from 'cors'
import { createServer } from "http"
import { Server } from "socket.io"

import { generateGrid, generateEmptyGrid, getSecretCode } from "./utils/generic"
import * as redis from "./utils/redis"

import { connectRedis } from "./redis"
import { addPayment, getAllPayments, initDB } from "./db"


const port = process.env.BACKEND_PORT

const app: Express = express()
app.use(
    cors({
        origin: true,
        credentials: true,
    })
)

app.use(express.json())

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }});

io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
        return next(new Error('Authentication token required'));
    }

    try {
        // Validation logic
        // Not a normal/correct way to it, but since there is no login panel
        // this was a simple way to show I can implement it 
        if(token !== process.env.TOKEN) new Error("Invalid token")
        next();
    } catch (err) {
        next(new Error('Invalid token'));
    }
});

let generatorTimeout: ReturnType<typeof setTimeout> | number = 0 

async function generate() {
  const bias = await redis.getBias();
  const grid = generateGrid(bias)
  const code = getSecretCode(grid)

  await redis.setGrid(grid);
  await redis.setCode(code);

  io.emit("NEW_GRID", { grid, code, bias })

  generatorTimeout = setTimeout(() => {
    generate()
  }, 2000) 
}

io.on('connection', (socket) => {
    console.log(`User ${socket.id} connected`); 

    socket.on("GENERATOR_CHECK", async () => {
      if(!generatorTimeout) return 
      
      const [grid, code, bias] = await Promise.all([
        redis.getGrid(),
        redis.getCode(),
        redis.getBias(),
      ])

      socket.emit("GENERATOR_START", { grid, code, bias })
    })

    socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected`);
    });
});

app.get("/generator", (req: Request, res: Response): any => {
  if(generatorTimeout) return res.json({})

  generate()
  res.json({})
})

app.get("/grid", async (req: Request, res: Response) => {
  res.json(JSON.stringify(await redis.getGrid()))
})

app.get("/code", async (req: Request, res: Response) => {
  res.json(JSON.stringify(await redis.getCode()))
})

app.post("/bias", async (req: Request, res: Response) => {
  const bias = req.body.bias
  await redis.setBias(bias)
  io.emit("NEW_BIAS", { bias })
  res.json({})
})

app.post("/payment", async (req: Request, res: Response) => {
  const { payment, amount } = req.body 
  // show users payments are being updated
  io.emit("PAYMENT_UPDATE")

  const [payments, grid, code] = await Promise.all([
    redis.getPayments(),
    redis.getGrid(),
    redis.getCode(),
  ])

  const newPayment: Payment = {
    payment,
    amount,
    grid,
    code
  }

  await addPayment(newPayment)
  payments.push(newPayment)
  await redis.setPayments(payments)

  // update users payments 
  io.emit("NEW_PAYMENT", payments)
  res.json(JSON.stringify(newPayment))
})

app.get("/payments", async (req: Request, res: Response) => {
  res.json(JSON.stringify(await redis.getPayments()))
})

async function main() {
  await connectRedis()
  await initDB()

  const payments = await getAllPayments()

  await Promise.all([
    redis.setPayments(payments),
    redis.setGrid(generateEmptyGrid()),
    redis.setCode(0),
    redis.setBias(""),
  ])
  
  httpServer.listen(port, () => {
    console.log("Server running on port %s", port)
  })
}

main()
