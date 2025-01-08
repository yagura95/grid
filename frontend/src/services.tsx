import { socket } from "./services/socket.ts"

export async function setBias(bias: string) {
  try {
      socket.emit("BIAS", { bias })
  } catch(e) {
    console.error(e)
  }
}

export async function startGenerator() {
  try {
    socket.emit("GENERATOR_START")
    console.log("GENERATOR_START")
  } catch(e) {
    console.error(e)
  }
}

export async function savePayment(payment: string, amount: string) {
  try {
    socket.emit("PAYMENT", { payment, amount })
  } catch(e) {
    console.error(e)
  }
}

export async function getPayments() {
  try {
    socket.emit("PAYMENTS")
  } catch(e) {
    console.error(e)
    return []
  }
}
