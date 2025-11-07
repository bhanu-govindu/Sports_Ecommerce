import React, { useState } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'

const CUSTOMER_ID = 1

export default function Checkout(){
  const [billingAddress, setBillingAddress] = useState('')
  const navigate = useNavigate()

  const placeOrder = async () => {
    try {
      const orderResp = await api.post(`/orders/${CUSTOMER_ID}/create`, { billingAddress })
      const orderId = orderResp.data.order_id
      await api.post('/payments', { order_id: orderId, payment_method: 'card', amount: 0 })
      alert('Order placed!')
      navigate('/')
    } catch (err) {
      console.error(err)
      alert('Could not place order: ' + (err.response?.data?.error || err.message))
    }
  }

  return (
    <div className="checkout">
      <h1 className="page-title">Checkout</h1>
      <label>Billing Address</label>
      <textarea value={billingAddress} onChange={(e)=>setBillingAddress(e.target.value)} />
      <button className="btn" onClick={placeOrder}>Place order</button>
    </div>
  )
}
