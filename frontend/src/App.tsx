import { BrowserRouter, Routes, Route } from "react-router-dom"

import Homepage from "./components/homepage/Homepage.tsx"
import Payments from "./components/payments/Payments.tsx"

const App = () => {
  return (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/payments" element={<Payments />} />
    </Routes>
  </BrowserRouter>
  )
}

export default App
