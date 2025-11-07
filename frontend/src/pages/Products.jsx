import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  Paper,
  Skeleton,
} from '@mui/material';
import { Search, SportsSoccer } from '@mui/icons-material';
import ProductCard from '../components/ProductCard';
import api from '../api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sportType, setSportType] = useState('all');

  useEffect(() => {
    api.get('/products')
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter(product => 
    product.product_name?.toLowerCase().includes(search.toLowerCase()) &&
    (sportType === 'all' || product.sport_type === sportType)
  );

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: '#1a237e',
          color: '#fff',
          mb: 4,
          py: 6,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <SportsSoccer sx={{ fontSize: 60, mb: 2 }} />
            <Typography
              component="h1"
              variant="h2"
              color="inherit"
              gutterBottom
              sx={{ fontWeight: 'bold' }}
            >
              Sports Equipment Shop
            </Typography>
            <Typography variant="h5" color="inherit" paragraph>
              Find the best equipment for your favorite sports
            </Typography>
          </Box>
        </Container>
      </Paper>

      <Container maxWidth="lg">
        {/* Filters */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <Select
                  value={sportType}
                  onChange={(e) => setSportType(e.target.value)}
                >
                  <MenuItem value="all">All Sports</MenuItem>
                  <MenuItem value="football">Football</MenuItem>
                  <MenuItem value="basketball">Basketball</MenuItem>
                  <MenuItem value="tennis">Tennis</MenuItem>
                  <MenuItem value="cricket">Cricket</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        {/* Products Grid */}
        <Grid container spacing={3}>
          {loading
            ? Array.from(new Array(8)).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Skeleton
                    variant="rectangular"
                    height={400}
                    sx={{ borderRadius: 1 }}
                  />
                </Grid>
              ))
            : filteredProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.product_id}>
                  <ProductCard product={product} />
                </Grid>
              ))}
        </Grid>

        {/* No Results Message */}
        {!loading && filteredProducts.length === 0 && (
          <Box sx={{ textAlign: 'center', my: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No products found matching your criteria
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Products;
