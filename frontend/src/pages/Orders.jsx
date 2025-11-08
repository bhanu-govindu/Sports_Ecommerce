import React, { useEffect, useState } from 'react'
import { Box, Paper, Typography, Grid, Button, Stack, TextField, Rating, Divider } from '@mui/material'
import api from '../api'
import { getCustomer } from '../auth'

export default function Orders(){
  const customer = getCustomer()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState({})
  const [review, setReview] = useState({})

  useEffect(()=>{
    if (!customer) return
    const load = async () => {
      try{
        const res = await api.get(`/orders/customer/${customer.customer_id}`)
        setOrders(res.data || [])
      }catch(e){ console.error(e) }
      setLoading(false)
    }
    load()
  }, [])

  const submitFeedback = async (orderId) => {
    try{
      const msg = feedback[orderId]
      if (!msg) return alert('Please enter feedback')
      await api.post('/feedbacks', { customer_id: customer.customer_id, order_id: orderId, message: msg })
      alert('Feedback sent to admin')
      setFeedback(prev => ({ ...prev, [orderId]: '' }))
    }catch(e){ console.error(e); alert('Failed to send feedback') }
  }

  const submitReview = async (orderId, item) => {
    try{
      const key = `${orderId}_${item.product_id}`
      const payload = review[key]
      if (!payload || !payload.comment) return alert('Please enter a comment')
      await api.post('/reviews', { product_id: item.product_id, customer_id: customer.customer_id, rating: payload.rating || 5, comment: payload.comment })
      alert('Review submitted')
      setReview(prev => ({ ...prev, [key]: { rating: 5, comment: '' } }))
    }catch(e){ console.error(e); alert('Failed to submit review') }
  }

  if (!customer) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
      <Paper sx={{ p: 4, width: { xs: '92%', sm: 720 } }}>
        <Typography variant="h6">Please sign in to view your orders</Typography>
      </Paper>
    </Box>
  )

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h5" sx={{ mb: 2 }}>My Orders</Typography>
      {loading ? <Typography>Loading…</Typography> : (
        orders.length === 0 ? <Typography>No orders yet.</Typography> : (
          <Stack spacing={2}>
            {orders.map(o => (
              <Paper key={o.order_id} sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <Typography variant="subtitle1">Order #{o.order_id} — {o.status}</Typography>
                    <Typography variant="body2" color="text.secondary">Ordered on: {new Date(o.order_date).toLocaleString()}</Typography>
                    <Divider sx={{ my: 1 }} />
                    {o.items.map(it => (
                      <Box key={it.product_id} sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                        <Box>
                          <Typography>{it.product_name}</Typography>
                          <Typography variant="body2" color="text.secondary">Qty: {it.quantity}</Typography>
                        </Box>
                        <Box sx={{ minWidth: 280 }}>
                          {o.status === 'Delivered' ? (
                            <Box>
                              <Typography variant="body2">Leave a review</Typography>
                              <Rating value={(review[`${o.order_id}_${it.product_id}`]?.rating) || 5} onChange={(e,v)=> setReview(prev=>({ ...prev, [`${o.order_id}_${it.product_id}`]: { ...(prev[`${o.order_id}_${it.product_id}`] || {}), rating: v } }))} />
                              <TextField fullWidth multiline rows={2} value={(review[`${o.order_id}_${it.product_id}`]?.comment) || ''} onChange={(e)=> setReview(prev=>({ ...prev, [`${o.order_id}_${it.product_id}`]: { ...(prev[`${o.order_id}_${it.product_id}`] || {}), comment: e.target.value } }))} sx={{ mt: 1 }} />
                              <Button size="small" variant="contained" sx={{ mt: 1 }} onClick={()=> submitReview(o.order_id, it)}>Submit Review</Button>
                            </Box>
                          ) : (
                            <Typography variant="body2" color="text.secondary">You can review this product after delivery.</Typography>
                          )}
                        </Box>
                      </Box>
                    ))}
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2">Feedback to admin</Typography>
                    <TextField fullWidth multiline rows={4} value={feedback[o.order_id] || ''} onChange={(e)=> setFeedback(prev=>({ ...prev, [o.order_id]: e.target.value }))} sx={{ mb: 1 }} />
                    <Button variant="outlined" onClick={()=> submitFeedback(o.order_id)}>Send Feedback</Button>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Stack>
        )
      )}
    </Box>
  )
}
