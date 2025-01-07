import "./PaymentsForm.css"

interface Props {
  payment: string,
  amount: string,
  updatePayment: (e: React.ChangeEvent<HTMLInputElement>) => void, 
  updateAmount: (e: React.ChangeEvent<HTMLInputElement>) => void, 
  addPayment: (e: React.FormEvent<HTMLFormElement>) => void,
}

const PaymentsForm = ({ payment, updatePayment, amount, updateAmount, addPayment }: Props) => {
  return <form onSubmit={addPayment}>
    <div className="form-item">
        <label className="form-label" htmlFor="payment">PAYMENT</label>
        <input className="form-input" placeholder="Payment" name="payment" type="text" onChange={updatePayment} value={payment}/>
    </div>
    <div className="form-item">
        <label className="form-label" htmlFor="amount">AMOUNT</label>
        <input className="form-input" placeholder="Amount" name="amount" type="text" onChange={updateAmount} value={amount}/>
    </div>
    <div className="form-item">
      <input type="submit" className="form-btn" value="+ ADD" />
    </div>
  </form>

}

export default PaymentsForm
