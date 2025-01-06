import express, { Express, Request, Response } from "express"
import dotenv from 'dotenv'
import cors from 'cors'
import { createServer } from "http"
import { Server } from "socket.io"
import { generateGrid, generateEmptyGrid, getSecretCode } from "./utils.ts"
import { Payment } from "./interface.ts"

dotenv.config();

const port = process.env.PORT

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

const payments: Payment[] = []
let grid = generateEmptyGrid() 
let bias = ""
let code = 0
let generatorTimeout: ReturnType<typeof setTimeout> | number = 0 

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

app.get("/generator", (req: Request, res: Response): any => {
  if(generatorTimeout) return res.json({})

  generate()
  res.json({})
})

app.get("/grid", (req: Request, res: Response) => {
  res.json(JSON.stringify(grid))
})

app.get("/code", (req: Request, res: Response) => {
  res.json(JSON.stringify(code))
})

app.post("/bias", (req: Request, res: Response) => {
  bias = req.body.bias
  io.emit("NEW_BIAS", { bias })
  res.json({})
})

app.post("/payment", (req: Request, res: Response) => {
  const { payment, amount } = req.body 

  const newPayment: Payment = {
    payment,
    amount,
    grid,
    code
  }

  payments.push(newPayment)

  io.emit("NEW_PAYMENT", payments)
  res.json(JSON.stringify(newPayment))
})

app.get("/payments", (req: Request, res: Response) => {
  res.json(JSON.stringify(payments))
})

httpServer.listen(port, () => {
  console.log("Server running on port %s", port)
})
