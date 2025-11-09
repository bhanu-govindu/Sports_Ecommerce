import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Rating,
  Skeleton,
  Stack,
  TextField,
  Typography,
  Alert,
} from '@mui/material'
import { AddShoppingCart, Favorite, FavoriteBorder, Share, LocalShipping, AssignmentReturn, Security, Remove, Add } from '@mui/icons-material'
import api from '../api'
import { getCustomer, getAdmin } from '../auth'
import { isLiked, toggleWishlist } from '../wishlist'
import { formatINR } from '../currency'
import { getProductImage } from '../assets/images'

export default function ProductDetails(){
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [wish, setWish] = useState(false)
  const [adding, setAdding] = useState(false)
  const [canReview, setCanReview] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [admin, setAdmin] = useState(null)

  useEffect(() => {
    const a = getAdmin()
    setAdmin(a)
  }, [])

  useEffect(()=>{
    let mounted = true
    setLoading(true)
    api.get(`/products/${id}`)
      .then(res => { if (mounted) setData(res.data) })
      .catch(console.error)
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [id])

  // Check if authenticated customer has a delivered order containing this product
  useEffect(() => {
    const c = getCustomer()
    if (!c) return
    api.get(`/orders/customer/${c.customer_id}`)
      .then(res => {
        const orders = res.data || []
        const eligible = orders.some(o => (o.status === 'Delivered') && (o.items || []).some(it => String(it.product_id) === String(id)))
        setCanReview(eligible)
      }).catch(err => { console.error('could not fetch customer orders', err); setCanReview(false) })
  }, [id])

  // Ensure page opens at the top whenever navigating to a product
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [id])

  useEffect(() => {
    try {
      if (data?.product?.product_id) setWish(isLiked(data.product.product_id))
    } catch {}
  }, [data?.product?.product_id])

  const product = data?.product
  const reviews = data?.reviews || []
  const inStock = (product?.stock_quantity ?? 0) > 0
  const imageUrl = useMemo(() => getProductImage(product), [product])
  const fallbackImageUrl = useMemo(() => getProductImage({ ...(product || {}), image_url: null }), [product])

  const changeQty = (next) => {
    const val = Math.max(1, Number(next) || 1)
    setQty(val)
  }

  const addToCart = async () => {
    if (!product) return
    if (!inStock) return alert('Out of stock')
    try {
      setAdding(true)
      const CUSTOMER = getCustomer()
      if (!CUSTOMER) {
        const url = `/auth?action=add&product_id=${product.product_id}&quantity=${qty}`
        return window.location.href = url
      }
      await api.post(`/carts/${CUSTOMER.customer_id}/add`, { product_id: product.product_id, quantity: qty })
      alert('Added to cart')
    } catch (e) {
      console.error(e)
      alert('Could not add to cart')
    } finally {
      setAdding(false)
    }
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Skeleton variant="rectangular" height={420} sx={{ borderRadius: 2 }} />
            <Skeleton variant="text" height={48} sx={{ mt: 2, width: '60%' }} />
            <Skeleton variant="text" height={24} sx={{ width: '90%' }} />
            <Skeleton variant="text" height={24} sx={{ width: '80%' }} />
          </Grid>
          <Grid item xs={12} md={5}>
            <Skeleton variant="rectangular" height={320} sx={{ borderRadius: 2 }} />
          </Grid>
        </Grid>
      </Container>
    )
  }

  if (!product) return <Container maxWidth="lg" sx={{ py: 6 }}><Alert severity="error">Product not found.</Alert></Container>

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Left: Gallery and details */}
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: 'background.paper' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Box sx={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 2,
                mb: 2,
                backgroundColor: '#f5f5f5',
                height: { xs: 280, sm: 360, md: 420 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Box component="img" src={imageUrl} alt={product.product_name} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = fallbackImageUrl }} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: 8, right: 8 }}>
                  <IconButton onClick={() => { toggleWishlist(product.product_id); setWish(v=>!v) }} sx={{ bgcolor: 'white' }}>
                    {wish ? <Favorite sx={{ color: '#e91e63' }} /> : <FavoriteBorder sx={{ color: '#616161' }} />}
                  </IconButton>
                  <IconButton sx={{ bgcolor: 'white' }}>
                    <Share sx={{ color: '#616161' }} />
                  </IconButton>
                </Stack>
              </Box>

              <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                {product.sport_type && <Chip label={product.sport_type} size="small" color="primary" variant="outlined" />}
                {product.brand && <Chip label={product.brand} size="small" />}
              </Stack>

              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                {product.product_name}
              </Typography>

              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <Rating value={Math.min(5, Math.max(0, Number(reviews?.[0]?.rating) || 4))} precision={0.5} readOnly size="small" />
                <Typography variant="body2" color="text.secondary">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</Typography>
              </Stack>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {product.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Highlights</Typography>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <LocalShipping fontSize="small" color="primary" />
                    <Typography variant="body2">Free shipping over ₹999</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <AssignmentReturn fontSize="small" color="primary" />
                    <Typography variant="body2">Easy 7-day returns</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Security fontSize="small" color="primary" />
                    <Typography variant="body2">Secure payments</Typography>
                  </Stack>
                </Grid>
              </Grid>
            </motion.div>
          </Paper>
        </Grid>

        {/* Right: Purchase panel */}
        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h4" color="primary" sx={{ fontWeight: 700, mb: 1 }}>
              {formatINR(product.price)}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: inStock ? 'success.main' : 'error.main' }}>
              {inStock ? `In stock (${product.stock_quantity} available)` : 'Out of stock'}
            </Typography>

            {!admin && (
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ minWidth: 72 }}>Quantity</Typography>
                <IconButton size="small" onClick={() => changeQty(qty - 1)} disabled={qty <= 1}>
                  <Remove />
                </IconButton>
                <TextField
                  value={qty}
                  onChange={(e) => changeQty(e.target.value)}
                  type="number"
                  size="small"
                  inputProps={{ min: 1, style: { textAlign: 'center', width: 56 } }}
                />
                <IconButton size="small" onClick={() => changeQty(qty + 1)}>
                  <Add />
                </IconButton>
              </Stack>
            )}

            {!admin && (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<AddShoppingCart />}
                  onClick={addToCart}
                  disabled={!inStock || adding}
                >
                  {adding ? 'Adding…' : 'Add to cart'}
                </Button>
                <Button fullWidth variant="outlined" color={wish ? 'secondary' : 'inherit'} onClick={() => { toggleWishlist(product.product_id); setWish(v=>!v) }}>
                  {wish ? 'Wishlisted' : 'Add to wishlist'}
                </Button>
              </Stack>
            )}

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ mb: 1 }}>Seller notes</Typography>
            <Typography variant="body2" color="text.secondary">
              Genuine quality equipment for {product.sport_type || 'sports'}. Perfect for training and matches.
            </Typography>
          </Paper>
        </Grid>

        {/* Reviews */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Customer Reviews</Typography>
            {reviews.length === 0 ? (
              <Typography variant="body2" color="text.secondary">No reviews yet.</Typography>
            ) : (
              <Stack spacing={2}>
                {reviews.map(r => (
                  <Box key={r.review_id} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                      <Typography variant="subtitle2">{r.customer_name}</Typography>
                      <Rating value={Number(r.rating) || 0} readOnly size="small" />
                    </Stack>
                    <Typography variant="body2" color="text.secondary">{r.comment}</Typography>
                  </Box>
                ))}
              </Stack>
            )}

            {/* Review form - only allowed if customer has a delivered order containing this product (not for admin) */}
            {!admin && getCustomer() && (
              <Box sx={{ mt: 3 }}>
                {canReview ? (
                  <Box component="form" onSubmit={async (e) => { e.preventDefault(); try {
                    const c = getCustomer();
                    await api.post('/reviews', { product_id: id, customer_id: c.customer_id, rating: reviewRating, comment: reviewComment });
                    alert('Review submitted');
                    // refresh product reviews
                    const res = await api.get(`/products/${id}`); setData(res.data);
                    setReviewComment(''); setReviewRating(5);
                  } catch (err) { console.error(err); alert('Failed to submit review') } }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>Write a review</Typography>
                    <Rating value={reviewRating} onChange={(e, v) => setReviewRating(v || 5)} />
                    <TextField fullWidth multiline rows={3} value={reviewComment} onChange={e=>setReviewComment(e.target.value)} sx={{ mt: 1, mb: 1 }} placeholder="Share your experience" />
                    <Button variant="contained" type="submit">Submit Review</Button>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>You can leave a review after the order is delivered.</Typography>
                )}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}
