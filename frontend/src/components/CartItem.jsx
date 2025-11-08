import React from 'react'
import { formatINR } from '../currency'

export default function CartItem({ item, onRemove }) {
  return (
    <div className="cart-item">
      <div>
        <div className="cart-title">{item.product_name}</div>
        <div className="cart-qty">Qty: {item.quantity}</div>
      </div>
      <div className="cart-right">
        <div className="cart-price">{formatINR(item.price * item.quantity)}</div>
        <button className="link-btn" onClick={() => onRemove(item.cart_item_id)}>Remove</button>
      </div>
    </div>
  )
}
