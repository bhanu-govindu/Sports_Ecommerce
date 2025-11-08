import React from 'react'
import { Container, Grid, Typography, Box, Button } from '@mui/material'
import ProductCard from '../components/ProductCard'
import api from '../api'
import { getWishlist } from '../wishlist'

export default function Wishlist(){
  const [products, setProducts] = React.useState([])
  const [ids, setIds] = React.useState(getWishlist())
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/products')
        setProducts(res.data || [])
      } catch (e) { console.error(e) }
      setLoading(false)
    }
    load()
  }, [])

  React.useEffect(() => {
    const handler = () => setIds(getWishlist())
    window.addEventListener('wishlistChange', handler)
    return () => window.removeEventListener('wishlistChange', handler)
  }, [])

  const liked = React.useMemo(() => {
    const idSet = new Set(ids.map(String))
    return products.filter(p => idSet.has(String(p.product_id)))
  }, [products, ids])

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>My Wishlist</Typography>
        {(!loading && liked.length === 0) && (
          <Box sx={{ textAlign: 'center', my: 6 }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              You haven’t liked any products yet.
            </Typography>
            <Button variant="contained" href="/products">Browse Products</Button>
          </Box>
        )}
        <Grid container spacing={3}>
          {(loading ? [] : liked).map(prod => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={prod.product_id}>
              <ProductCard product={prod} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}
