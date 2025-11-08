import React, { useEffect, useState } from 'react'
import api from '../api'
import CartItem from '../components/CartItem'
import { Link } from 'react-router-dom'
import { getCustomer } from '../auth'
import { formatINR } from '../currency'

export default function Cart(){
  const [items, setItems] = useState([])
  const [cart, setCart] = useState(null)

  const loadCart = async () => {
    const CUSTOMER = getCustomer()
    if (!CUSTOMER) return window.location.href = '/auth?next=/cart'
    const res = await api.get(`/carts/${CUSTOMER.customer_id}`)
    setCart(res.data.cart)
    setItems(res.data.items)
  }

  useEffect(()=> { loadCart() }, [])

  const removeItem = async (cart_item_id) => {
    const CUSTOMER = getCustomer()
    if (!CUSTOMER) return window.location.href = '/auth?next=/cart'
    await api.post(`/carts/${CUSTOMER.customer_id}/remove`, { cart_item_id })
    loadCart()
  }

  const total = items.reduce((s,i)=> s + Number(i.price) * Number(i.quantity), 0)

  return (
    <div>
      <h1 className="page-title">Your Cart</h1>
      {items.length === 0 ? <p>Your cart is empty. <Link to="/">Shop now</Link></p> : (
        <>
          <div className="cart-list">
            {items.map(it => <CartItem key={it.cart_item_id} item={it} onRemove={removeItem} />)}
          </div>
          <div className="checkout-box">
            <div className="total">Total: {formatINR(total)}</div>
            <Link to="/checkout" className="btn">Checkout</Link>
          </div>
        </>
      )}
    </div>
  )
}
