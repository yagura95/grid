import { useEffect, useState } from "react"
import { getSecretCode, savePayment, getPayments } from "../../services"
import { Payment } from "../../Interfaces.ts"

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
    
    const newPayment= await savePayment(payment, amount)
    setPayments(prev => [...prev, newPayment])
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

    setInterval(async () => {
      setCode(await getSecretCode())
    }, 2000)
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
