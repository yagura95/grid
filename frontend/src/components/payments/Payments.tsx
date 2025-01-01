import { useEffect, useState } from "react"

import { Payment } from "../../Interfaces.ts"
import { socket } from "../../services/socket.ts"
import { getSecretCode, savePayment, getPayments } from "../../services"

import SecretCode from "../homepage/SecretCode"
import PaymentsForm from "./PaymentsForm.tsx"
import PaymentsGrid from "./PaymentsGrid.tsx"

const Payments = () => {
  const [code, setCode] = useState<number>(0)
  const [payments, setPayments] = useState<Payment[]>([])
  const [payment, setPayment] = useState<string>("")
  const [amount, setAmount] = useState<string>("")

  function updatePayment(e: any) {
    setPayment(e.target.value)
  }

  async function addPayment(e: any) {
    e.preventDefault()

    if(!payment || !amount) return 
    
    await savePayment(payment, amount)

    setPayment("")
    setAmount("")
  }

  function updateAmount(e: any) {
    const value = e.target.value
    if(!value.match("^[0-9]*$")) return setAmount("")

    setAmount(value)
  }

  useEffect(() => {
    getPayments().then(savedPayments => {
      setPayments(savedPayments) 
    })

    getSecretCode().then((code) => {
      setCode(code)
    })

    socket.on("NEW_GRID", ({ code }) => {
      setCode(code)
    })

    socket.on("NEW_PAYMENT", (payments) =>  {
      setPayments(payments)
    })

    return () => {
      socket.off("NEW_GRID")
      socket.off("NEW_PAYMENT")
    }
  }, [])

  return <div className="container">
    <SecretCode code={code}/>
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
