import { useEffect, useState } from "react"

import { Payment } from "../../Interfaces.ts"
import { socket } from "../../services/socket.ts"
import { savePayment, getPayments } from "../../services"

import SecretCode from "../homepage/SecretCode"
import PaymentsForm from "./PaymentsForm.tsx"
import PaymentsGrid from "./PaymentsGrid.tsx"
import UpdateMessage from "./UpdateMessage.tsx"

const Payments = () => {
  const [code, setCode] = useState<number>(0)
  const [paymentUpdate, setPaymentUpdate] = useState<boolean>(false)
  const [payments, setPayments] = useState<Payment[]>([])
  const [payment, setPayment] = useState<string>("")
  const [amount, setAmount] = useState<string>("")

  function updatePayment(e: React.ChangeEvent<HTMLInputElement>) {
    setPayment(e.target.value)
  }

  async function addPayment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if(!payment || !amount) return 
    
    await savePayment(payment, amount)

    setPayment("")
    setAmount("")
  }

  function updateAmount(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    if(!value.match("^[0-9]*$")) return setAmount("")

    setAmount(value)
  }

  useEffect(() => {
    getPayments()

    socket.on("PAYMENTS", (payments) => {
      setPayments(payments)
      setPaymentUpdate(false)
    })

    socket.on("PAYMENT_UPDATE", () => {
      setPaymentUpdate(true)
    })

    socket.on("GENERATOR_STATE", ({ code }) => {
      setCode(code)
    })

    return () => {
      socket.off("PAYMENTS")
      socket.off("GENERATOR_STATE")
      socket.off("NEW_PAYMENT")
    }
  }, [])

  return <div className="container">
    <SecretCode code={code}/>
    <UpdateMessage update={paymentUpdate}/>
    <PaymentsForm 
      payment={payment} 
      updatePayment={updatePayment} 
      amount={amount} 
      updateAmount={updateAmount}
      addPayment={addPayment}
    />
    <PaymentsGrid payments={payments}/>
  </div>
}

export default Payments
