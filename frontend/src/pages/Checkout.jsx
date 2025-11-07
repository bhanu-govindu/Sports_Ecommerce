import React, { useState } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'

const getCustomer = () => { try { return JSON.parse(localStorage.getItem('customer')) } catch { return null } }
const CUSTOMER = getCustomer()

export default function Checkout(){
  const [billingAddress, setBillingAddress] = useState(CUSTOMER?.address || '')
  const [total, setTotal] = useState(0)

  const loadCartTotal = async () => {
    if (!CUSTOMER) return window.location.href = '/auth?next=/checkout'
    const res = await api.get(`/carts/${CUSTOMER.customer_id}`)
    const items = res.data.items || []
    setTotal(items.reduce((s,i)=> s + Number(i.price) * Number(i.quantity), 0))
  }
  const navigate = useNavigate()

  const placeOrder = async () => {
    try {
      if (!CUSTOMER) return window.location.href = '/auth?next=/checkout'
      const orderResp = await api.post(`/orders/${CUSTOMER.customer_id}/create`, { billingAddress })
      const orderId = orderResp.data.order_id
      // create payment record for COD
      await api.post('/payments', { order_id: orderId, payment_method: 'cod', amount: total })
      alert('Order placed (Cash on Delivery)!')
      navigate('/')
    } catch (err) {
      console.error(err)
      alert('Could not place order: ' + (err.response?.data?.error || err.message))
    }
  }

  React.useEffect(()=>{ loadCartTotal() }, [])

  React.useEffect(()=>{
    // prefill billing address from saved profile if available
    if (!billingAddress && CUSTOMER?.address) setBillingAddress(CUSTOMER.address)
  }, [])

  return (
    <div className="checkout">
      <h1 className="page-title">Checkout</h1>
      <label>Billing Address</label>
      <textarea value={billingAddress} onChange={(e)=>setBillingAddress(e.target.value)} />
      <div style={{ marginTop: 12 }}>
        <div>Total: ₹{total.toFixed(2)}</div>
        <div style={{ color: 'red', marginTop: 8 }}>
          {billingAddress.trim() === '' && <small>Please enter a billing/shipping address to place the order.</small>}
        </div>
        <button className="btn" onClick={placeOrder} disabled={billingAddress.trim() === ''}>Place order (Cash on Delivery)</button>
      </div>
    </div>
  )
}
