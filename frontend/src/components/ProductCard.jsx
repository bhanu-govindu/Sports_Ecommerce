import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  Rating,
  useTheme,
  IconButton,
} from '@mui/material';
import { AddShoppingCart, Favorite, Share } from '@mui/icons-material';
import api from '../api'
import { getCustomer } from '../auth'
import { isLiked, toggleWishlist } from '../wishlist'

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  React.useEffect(() => {
    try { setIsFavorite(isLiked(product.product_id)) } catch {}
  }, [product?.product_id])

  // Placeholder image URL - replace with your actual product images
  const imageUrl = `https://source.unsplash.com/400x300/?${product.sport_type},sports`;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    hover: {
      y: -10,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    tap: {
      scale: 0.95
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card 
        sx={{ 
          maxWidth: 345,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'visible',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          boxShadow: isHovered ? theme.shadows[10] : theme.shadows[2],
          transition: 'box-shadow 0.3s ease-in-out',
        }}
      >
        <motion.div
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.3 }}
          style={{ position: 'relative' }}
        >
          <CardMedia
            component="img"
            height="200"
            image={imageUrl}
            alt={product.product_name}
            sx={{ 
              objectFit: 'cover',
              borderRadius: '8px 8px 0 0',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              display: 'flex',
              gap: 1,
            }}
          >
            <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
              <IconButton
                size="small"
                sx={{ 
                  backgroundColor: 'white',
                  '&:hover': { backgroundColor: 'white' }
                }}
                onClick={(e) => { e.stopPropagation?.(); toggleWishlist(product.product_id); setIsFavorite(v=>!v) }}
              >
                <Favorite 
                  sx={{ 
                    color: isFavorite ? '#e91e63' : '#757575',
                    transition: 'color 0.3s ease'
                  }} 
                />
              </IconButton>
            </motion.div>
            <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
              <IconButton
                size="small"
                sx={{ 
                  backgroundColor: 'white',
                  '&:hover': { backgroundColor: 'white' }
                }}
              >
                <Share sx={{ color: '#757575' }} />
              </IconButton>
            </motion.div>
          </Box>
        </motion.div>

        <CardContent sx={{ flexGrow: 1, pt: 2 }}>
          <motion.div
            animate={{ y: isHovered ? -5 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 600 }}>
              {product.product_name}
            </Typography>
          </motion.div>

          <Box sx={{ mb: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <motion.div whileHover={{ scale: 1.1 }}>
              <Chip 
                label={product.sport_type} 
                size="small" 
                sx={{ 
                  backgroundColor: '#e3f2fd',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#bbdefb'
                  }
                }} 
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }}>
              <Chip 
                label={product.brand} 
                size="small"
                sx={{ 
                  backgroundColor: '#f3e5f5',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#e1bee7'
                  }
                }}
              />
            </motion.div>
          </Box>

          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {product.description?.slice(0, 100)}...
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <motion.div whileHover={{ scale: 1.1 }}>
              <Rating value={4} readOnly size="small" sx={{ mr: 1 }} />
            </motion.div>
            <Typography variant="body2" color="text.secondary">
              (4.0)
            </Typography>
          </Box>

          <motion.div
            animate={{ 
              scale: isHovered ? 1.1 : 1,
              y: isHovered ? -5 : 0
            }}
            transition={{ duration: 0.2 }}
          >
            <Typography variant="h6" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
              ${product.price}
            </Typography>
          </motion.div>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            gap: 1
          }}>
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              style={{ flex: 1 }}
            >
              <Button 
                fullWidth
                variant="contained" 
                size="small"
                onClick={() => navigate(`/product/${product.product_id}`)}
                sx={{ 
                  backgroundColor: '#1a237e',
                  '&:hover': {
                    backgroundColor: '#283593'
                  }
                }}
              >
                View Details
              </Button>
            </motion.div>
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              style={{ flex: 1 }}
            >
              <Button
                fullWidth
                variant="outlined"
                size="small"
                startIcon={<AddShoppingCart />}
                onClick={async () => {
                  try {
                    const customer = getCustomer()
                    if (!customer) {
                      // redirect to auth page and request add-to-cart after login
                      return navigate(`/auth?action=add&product_id=${product.product_id}&quantity=1`)
                    }
                    await api.post(`/carts/${customer.customer_id}/add`, { product_id: product.product_id, quantity: 1 })
                    alert('Added to cart')
                  } catch (err) {
                    console.error(err)
                    alert('Could not add to cart')
                  }
                }}
                sx={{ 
                  color: '#1a237e', 
                  borderColor: '#1a237e',
                  '&:hover': {
                    borderColor: '#283593',
                    color: '#283593',
                    backgroundColor: 'rgba(26, 35, 126, 0.04)'
                  }
                }}
              >
                Add to Cart
              </Button>
            </motion.div>
          </Box>
        </CardContent>

        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              bottom: -20,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: -1,
              width: '80%',
              height: '20px',
              background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 70%)'
            }}
          />
        )}
      </Card>
    </motion.div>
  );
};

export default ProductCard;
