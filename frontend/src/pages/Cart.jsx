import React, { useEffect, useState } from 'react'
import api from '../api'
import CartItem from '../components/CartItem'
import { Link } from 'react-router-dom'
import { getCustomer } from '../auth'
import { formatINR } from '../currency'
import { Box, Grid, Typography, Paper, Button, Divider, Stack } from '@mui/material'
import { motion } from 'framer-motion'

export default function Cart(){
  const [items, setItems] = useState([])
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(false)

  const CUSTOMER = getCustomer()

  const loadCart = async () => {
    if (!CUSTOMER) return window.location.href = '/auth?next=/cart'
    setLoading(true)
    try {
      const res = await api.get(`/carts/${CUSTOMER.customer_id}`)
      setCart(res.data.cart)
      setItems(res.data.items)
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=> { loadCart() }, [])

  const removeItem = async (cart_item_id) => {
    if (!CUSTOMER) return window.location.href = '/auth?next=/cart'
    await api.post(`/carts/${CUSTOMER.customer_id}/remove`, { cart_item_id })
    loadCart()
  }

  const increaseQty = async (item) => {
    if (!CUSTOMER) return window.location.href = '/auth?next=/cart'
    await api.post(`/carts/${CUSTOMER.customer_id}/add`, { product_id: item.product_id, quantity: 1 })
    loadCart()
  }

  const decreaseQty = async (item) => {
    if (!CUSTOMER) return window.location.href = '/auth?next=/cart'
    if (item.quantity > 1) {
      // decrement by 1 using same add endpoint with qty -1
      await api.post(`/carts/${CUSTOMER.customer_id}/add`, { product_id: item.product_id, quantity: -1 })
    } else {
      await api.post(`/carts/${CUSTOMER.customer_id}/remove`, { cart_item_id: item.cart_item_id })
    }
    loadCart()
  }

  const total = items.reduce((s,i)=> s + Number(i.price) * Number(i.quantity), 0)

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>Your Cart</Typography>

      {items.length === 0 ? (
        <Paper sx={{ p: 4 }}>
          <Typography>Your cart is empty. <Link to="/">Shop now</Link></Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <Stack direction="column" spacing={2}>
                {items.map(it => (
                  <Box key={it.cart_item_id} sx={{ mb: 2 }}>
                    <CartItem item={it} onRemove={removeItem} onIncrease={increaseQty} onDecrease={decreaseQty} />
                  </Box>
                ))}
              </Stack>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, position: 'sticky', top: 24 }} elevation={3}>
              <Typography variant="h6">Order Summary</Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="text.secondary">Subtotal</Typography>
                <Typography>{formatINR(total)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography color="text.secondary">Shipping</Typography>
                <Typography>{formatINR(0)}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6">{formatINR(total)}</Typography>
              </Box>
              <Button component={Link} to="/checkout" variant="contained" color="primary" fullWidth>Checkout</Button>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  )
}
