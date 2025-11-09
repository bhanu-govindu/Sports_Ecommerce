import React from 'react'
import { Box, Card, CardMedia, CardContent, Typography, IconButton, Button, Stack } from '@mui/material'
import { Add, Remove, Delete } from '@mui/icons-material'
import { formatINR } from '../currency'
import { getProductImage } from '../assets/images'

export default function CartItem({ item, onRemove, onIncrease, onDecrease }) {
  const img = getProductImage(item)
  const fallbackImg = getProductImage({ ...(item || {}), image_url: null })
  return (
    <Card elevation={2} sx={{ display: 'flex', alignItems: 'center', borderRadius: 2 }}>
      <CardMedia
        component="img"
        image={img}
        alt={item.product_name}
        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = fallbackImg }}
        sx={{ width: 140, height: 110, objectFit: 'cover', borderRadius: '8px 0 0 8px' }}
      />
      <CardContent sx={{ flex: 1, py: 1, '&:last-child': { pb: 1 } }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{item.product_name}</Typography>
        <Typography variant="body2" color="text.secondary">{formatINR(item.price)} each</Typography>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
          <IconButton size="small" onClick={() => onDecrease(item)} aria-label="decrease">
            <Remove />
          </IconButton>
          <Typography sx={{ minWidth: 28, textAlign: 'center' }}>{item.quantity}</Typography>
          <IconButton size="small" onClick={() => onIncrease(item)} aria-label="increase">
            <Add />
          </IconButton>
          <Box sx={{ flex: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{formatINR(item.price * item.quantity)}</Typography>
          <IconButton size="small" onClick={() => onRemove(item.cart_item_id)} aria-label="remove" sx={{ ml: 1 }}>
            <Delete />
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  )
}
