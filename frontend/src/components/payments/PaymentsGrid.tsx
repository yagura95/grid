import "./PaymentsGrid.css"
import { Payment } from "../../Interfaces.ts"

interface Props {
  payments: Payment[] 
}

const PaymentsGrid = ({ payments }: Props) => {
  return (<table className="payments-grid">
    <thead>
      <tr>
        <th>NAME</th>
        <th>AMOUNT</th>
        <th>CODE</th>
        <th>GRID</th>
      </tr>
    </thead>
    <tbody>
    {
      payments.map((payment, i) => {
        return (
         <tr key={i}>
          <td>{payment.payment}</td>
          <td>{payment.amount}</td>
          <td>{payment.code}</td>
          <td>100</td>
        </tr>)
      })
    }
    </tbody>
  </table>)
}

export default PaymentsGrid
