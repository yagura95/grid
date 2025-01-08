import dotenv from "dotenv";
dotenv.config();
import express, { Express, Request, Response } from "express";
import { Payment } from "./types";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import {
  generateGrid,
  generateEmptyGrid,
  getSecretCode,
} from "./utils/generic";
import * as redis from "./utils/redis";

import { connectRedis } from "./redis";
import { addPayment, getAllPayments, initDB } from "./db";

import { authentication } from "./socket";

const port = process.env.BACKEND_PORT;

const app: Express = express();
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.use(authentication);

let generatorTimeout: ReturnType<typeof setTimeout> | number = 0;

async function generate() {
  const bias = await redis.getBias();
  const grid = generateGrid(bias);
  const code = getSecretCode(grid);

  await redis.setGrid(grid);
  await redis.setCode(code);

  console.log({ code, bias, grid })
  io.emit("GENERATOR_STATE", { grid, code, bias });

  generatorTimeout = setTimeout(() => {
    generate();
  }, 2000);
}

io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);

  socket.on("GENERATOR_CHECK", async () => {
    if (!generatorTimeout) return;

    const [grid, code, bias] = await Promise.all([
      redis.getGrid(),
      redis.getCode(),
      redis.getBias(),
    ]);

    socket.emit("GENERATOR_STATE", { grid, code, bias });
  });

  socket.on("GENERATOR_START", async () => {
    if (generatorTimeout) return;
    generate();
  });

  socket.on("BIAS", async ({ bias }) => {
    await redis.setBias(bias);
    io.emit("BIAS", { bias });
  });

  socket.on("PAYMENT", async ({ payment, amount }) => {
    io.emit("PAYMENT_UPDATE");

    const [payments, grid, code] = await Promise.all([
      redis.getPayments(),
      redis.getGrid(),
      redis.getCode(),
    ]);

    const newPayment: Payment = {
      payment,
      amount,
      grid,
      code,
    };

    await addPayment(newPayment);
    payments.push(newPayment);
    await redis.setPayments(payments);

    // update users payments
    io.emit("PAYMENTS", payments);
  });

  socket.on("PAYMENTS", async () => {
    const payments = await redis.getPayments();
    io.emit("PAYMENTS", payments);
  });

  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);
  });
});

async function main() {
  await connectRedis();
  await initDB();

  const payments = await getAllPayments();

  await Promise.all([
    redis.setPayments(payments),
    redis.setGrid(generateEmptyGrid()),
    redis.setCode(0),
    redis.setBias(""),
  ]);

  httpServer.listen(port, () => {
    console.log("Server running on port %s", port);
  });
}

main();
