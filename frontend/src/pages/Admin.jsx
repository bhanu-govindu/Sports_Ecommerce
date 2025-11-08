import React, { useState, useEffect } from 'react'
import { Box, Paper, Tabs, Tab, TextField, Button, Typography, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import api from '../api'

export default function Admin(){
  const [tab, setTab] = useState(0)
  const [product, setProduct] = useState({ name: '', price: '', category: '', image_url: '', description: '', quantity: '' })
  const [orders, setOrders] = useState([])
  const [orderDetail, setOrderDetail] = useState(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [message, setMessage] = useState(null)
  const [reviewsList, setReviewsList] = useState([])
  const [feedbacksList, setFeedbacksList] = useState([])

  useEffect(()=>{ if (tab === 1) fetchOrders() }, [tab])
  useEffect(()=>{ if (tab === 2) { fetchReviews(); fetchFeedbacks(); } }, [tab])

  const handleTab = (_, v) => setTab(v)

  const handleProductChange = (field) => (e) => setProduct(prev => ({ ...prev, [field]: e.target.value }))

  const submitProduct = async () => {
    try {
      const payload = { ...product, price: Number(product.price), quantity: Number(product.quantity) }
      await api.post('/products', payload)
      setMessage({ type: 'success', text: 'Product added successfully' })
      setProduct({ name: '', price: '', category: '', image_url: '', description: '', quantity: '' })
    } catch (err) {
      console.error(err)
      setMessage({ type: 'error', text: 'Failed to add product: ' + (err.response?.data?.error || err.message) })
    }
    setTimeout(()=>setMessage(null), 4000)
  }

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders')
      setOrders(res.data || [])
    } catch (err) {
      console.error(err)
      setMessage({ type: 'error', text: 'Failed to fetch orders' })
      setTimeout(()=>setMessage(null), 4000)
    }
  }

  const fetchReviews = async () => {
    try {
      const res = await api.get('/reviews')
      setReviewsList(res.data || [])
    } catch (err) {
      console.error(err)
      setMessage({ type: 'error', text: 'Failed to fetch reviews' })
      setTimeout(()=>setMessage(null), 3000)
    }
  }

  const fetchFeedbacks = async () => {
    try {
      const res = await api.get('/feedbacks')
      setFeedbacksList(res.data || [])
    } catch (err) {
      console.error(err)
      setMessage({ type: 'error', text: 'Failed to fetch feedbacks' })
      setTimeout(()=>setMessage(null), 3000)
    }
  }

  const markShipped = async (orderId) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: 'Shipped' })
      setMessage({ type: 'success', text: 'Order updated' })
      fetchOrders()
    } catch (err) {
      console.error(err)
      setMessage({ type: 'error', text: 'Failed to update order' })
      setTimeout(()=>setMessage(null), 4000)
    }
  }

  const openDetail = async (orderId) => {
    setDetailOpen(true)
    setOrderDetail(null)
    try {
      const res = await api.get(`/orders/${orderId}`)
      setOrderDetail(res.data)
    } catch (err) {
      console.error(err)
      setMessage({ type: 'error', text: 'Failed to load order details' })
      setTimeout(()=>setMessage(null), 3000)
    }
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Paper sx={{ p: 2 }} elevation={4}>
        <Typography variant="h5" sx={{ mb: 2 }}>Admin Dashboard</Typography>
        <Tabs value={tab} onChange={handleTab} sx={{ mb: 2 }}>
          <Tab label="Add Product" />
          <Tab label="Manage Orders" />
          <Tab label="Reviews & Feedback" />
        </Tabs>

        {message && <Alert severity={message.type} sx={{ mb: 2 }}>{message.text}</Alert>}

        {tab === 0 && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Name" value={product.name} onChange={handleProductChange('name')} sx={{ mb: 2 }} />
              <TextField fullWidth label="Price" value={product.price} onChange={handleProductChange('price')} sx={{ mb: 2 }} />
              <TextField fullWidth label="Category" value={product.category} onChange={handleProductChange('category')} sx={{ mb: 2 }} />
              <TextField fullWidth label="Image URL" value={product.image_url} onChange={handleProductChange('image_url')} sx={{ mb: 2 }} />
              <TextField fullWidth label="Quantity" value={product.quantity} onChange={handleProductChange('quantity')} sx={{ mb: 2 }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Description" value={product.description} onChange={handleProductChange('description')} sx={{ mb: 2 }} multiline rows={8} />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="contained" onClick={submitProduct}>Add Product</Button>
              </Box>
            </Grid>
          </Grid>
        )}

        {tab === 1 && (
          <>
          <TableContainer sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map(o => (
                  <TableRow key={o.order_id}>
                    <TableCell>{o.order_id}</TableCell>
                    <TableCell>{o.customer_name || o.customer?.name || o.customer_id}</TableCell>
                    <TableCell>
                      <Select
                        value={o.status || 'Pending'}
                        size="small"
                        onChange={async (e) => {
                          const newStatus = e.target.value
                          // optimistic update
                          setOrders(prev => prev.map(x => x.order_id === o.order_id ? { ...x, status: newStatus } : x))
                          try {
                            await api.put(`/orders/${o.order_id}/status`, { status: newStatus })
                            setMessage({ type: 'success', text: 'Order updated' })
                          } catch (err) {
                            console.error(err)
                            setMessage({ type: 'error', text: 'Failed to update order' })
                            // rollback on error
                            setOrders(prev => prev.map(x => x.order_id === o.order_id ? { ...x, status: o.status } : x))
                          }
                          setTimeout(()=>setMessage(null), 3000)
                        }}
                      >
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Processing">Processing</MenuItem>
                        <MenuItem value="Shipped">Shipped</MenuItem>
                        <MenuItem value="Delivered">Delivered</MenuItem>
                        <MenuItem value="Cancelled">Cancelled</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell>{o.total || ''}</TableCell>
                    <TableCell sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" onClick={() => openDetail(o.order_id)}>View</Button>
                      {o.status !== 'Delivered' && (
                        <Button size="small" variant="contained" onClick={async () => {
                          const prevStatus = o.status
                          // optimistic update
                          setOrders(prev => prev.map(x => x.order_id === o.order_id ? { ...x, status: 'Delivered' } : x))
                          try {
                            await api.put(`/orders/${o.order_id}/status`, { status: 'Delivered' })
                            setMessage({ type: 'success', text: 'Order marked Delivered' })
                          } catch (err) {
                            console.error(err)
                            setMessage({ type: 'error', text: 'Failed to mark delivered' })
                            // rollback
                            setOrders(prev => prev.map(x => x.order_id === o.order_id ? { ...x, status: prevStatus } : x))
                          }
                          setTimeout(()=>setMessage(null), 3000)
                        }}>Mark Delivered</Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="md" fullWidth>
            <DialogTitle>Order Details</DialogTitle>
            <DialogContent>
              {orderDetail ? (
                <Box>
                  <Typography variant="subtitle1">Order ID: {orderDetail.order_id}</Typography>
                  <Typography variant="body2">Customer: {orderDetail.customer_name} ({orderDetail.email})</Typography>
                  <Typography variant="body2">Status: {orderDetail.status}</Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2">Items</Typography>
                    {orderDetail.items.map(it => (
                      <Box key={it.product_id} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                        <Typography>{it.product_name} x {it.quantity}</Typography>
                        <Typography>Product ID: {it.product_id}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              ) : (
                <Typography>Loading…</Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailOpen(false)}>Close</Button>
              {orderDetail && orderDetail.status !== 'Delivered' && (
                <Button variant="contained" onClick={async () => {
                  try {
                    await api.put(`/orders/${orderDetail.order_id}/status`, { status: 'Delivered' })
                    setMessage({ type: 'success', text: 'Marked delivered' })
                    setOrders(prev => prev.map(x => x.order_id === orderDetail.order_id ? { ...x, status: 'Delivered' } : x))
                    setOrderDetail(prev => ({ ...prev, status: 'Delivered' }))
                  } catch (err) { console.error(err); setMessage({ type: 'error', text: 'Failed to mark delivered' }) }
                  setTimeout(()=>setMessage(null), 3000)
                }}>Mark Delivered</Button>
              )}
            </DialogActions>
          </Dialog>
          </>
        )}

        {tab === 2 && (
          <>
            <Typography variant="h6" sx={{ mt: 2 }}>Customer Reviews</Typography>
            <TableContainer sx={{ mt: 1 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Review ID</TableCell>
                    <TableCell>Product</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Comment</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reviewsList.map(r => (
                    <TableRow key={r.review_id}>
                      <TableCell>{r.review_id}</TableCell>
                      <TableCell>{r.product_name || r.product_id}</TableCell>
                      <TableCell>{r.customer_name || r.customer_id}</TableCell>
                      <TableCell>{r.rating}</TableCell>
                      <TableCell>{r.comment}</TableCell>
                      <TableCell>{new Date(r.review_date).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Typography variant="h6" sx={{ mt: 4 }}>Customer Feedbacks</Typography>
            <TableContainer sx={{ mt: 1 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Feedback ID</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Message</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {feedbacksList.map(f => (
                    <TableRow key={f.feedback_id}>
                      <TableCell>{f.feedback_id}</TableCell>
                      <TableCell>{f.customer_name || f.customer_id}</TableCell>
                      <TableCell>{f.order_id || '-'}</TableCell>
                      <TableCell>{f.message}</TableCell>
                      <TableCell>{new Date(f.created_at).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Paper>
    </Box>
  )
}
