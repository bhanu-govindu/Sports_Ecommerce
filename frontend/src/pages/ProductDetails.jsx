import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api'

export default function ProductDetails(){
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [qty, setQty] = useState(1)
  const CUSTOMER_ID = 1

  useEffect(()=>{
    api.get(`/products/${id}`).then(res => setData(res.data)).catch(console.error)
  }, [id])

  if(!data) return <div>Loading...</div>
  const { product, reviews } = data

  const addToCart = async () => {
    await api.post(`/carts/${CUSTOMER_ID}/add`, { product_id: product.product_id, quantity: qty })
    alert('Added to cart')
  }

  return (
    <div className="details-grid">
      <div className="details-main">
        <div className="image-large">Image</div>
        <h2>{product.product_name}</h2>
        <p>{product.description}</p>
        <div className="price-block">₹{product.price} <span className="stock">Stock: {product.stock_quantity}</span></div>
        <div className="add-row">
          <input type="number" value={qty} min="1" onChange={(e)=>setQty(e.target.value)} className="qty" />
          <button className="btn" onClick={addToCart}>Add to cart</button>
        </div>
      </div>
      <aside className="details-aside">
        <h3>Reviews</h3>
        {reviews.length === 0 ? <p>No reviews</p> : reviews.map(r => (
          <div key={r.review_id} className="review">
            <div className="review-head">{r.customer_name} — {r.rating}★</div>
            <div>{r.comment}</div>
          </div>
        ))}
      </aside>
    </div>
  )
}
