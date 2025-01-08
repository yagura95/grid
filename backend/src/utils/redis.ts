import { Grid, Payment } from "../types";
import redisClient from "../redis";

export async function setGrid(grid: Grid): Promise<void> {
  await redisClient.set("grid", JSON.stringify(grid));
}

export async function getGrid(): Promise<Grid> {
  return JSON.parse((await redisClient.get("grid")) || "");
}

export async function setPayments(payments: Payment[]): Promise<void> {
  await redisClient.set("payments", JSON.stringify(payments || []));
}

export async function getPayments(): Promise<Payment[]> {
  return JSON.parse((await redisClient.get("payments")) || "");
}

export async function setCode(code: number): Promise<void> {
  await redisClient.set("code", code);
}

export async function getCode(): Promise<number> {
  return parseInt((await redisClient.get("code")) || "0");
}

export async function setBias(bias: string): Promise<void> {
  await redisClient.set("bias", bias);
}

export async function getBias(): Promise<string> {
  return (await redisClient.get("bias")) || "";
}
