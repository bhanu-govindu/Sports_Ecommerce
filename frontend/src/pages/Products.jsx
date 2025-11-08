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
  Chip,
} from '@mui/material';
import { Search, SportsSoccer } from '@mui/icons-material';
import ProductCard from '../components/ProductCard';
import api from '../api';
import { useLocation } from 'react-router-dom';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sportType, setSportType] = useState('all');
  const [categories, setCategories] = useState([])
  const [categoryId, setCategoryId] = useState('all')
  const location = useLocation()

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, cRes] = await Promise.all([api.get('/products'), api.get('/categories')])
        setProducts(pRes.data)
        setCategories(cRes.data)
      } catch (err) { console.error(err) }
      setLoading(false)
    }
    load()
  }, []);

  // Pick sport from query string, e.g. /products?sport=Football
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const sp = params.get('sport')
    if (sp) { setSportType(sp); setCategoryId('all') }
  }, [location.search])

  // derive sport types dynamically from products
  const sportTypes = React.useMemo(() => {
    const set = new Set();
    products.forEach(p => { if (p.sport_type) set.add(p.sport_type) });
    return Array.from(set).sort();
  }, [products]);

  // derive categories relevant to selected sport type
  const availableCategories = React.useMemo(() => {
    if (sportType === 'all') return categories;
    const catIds = new Set(products.filter(p => p.sport_type === sportType).map(p => p.category_id));
    return categories.filter(c => catIds.has(c.category_id));
  }, [categories, products, sportType]);

  const filteredProducts = products.filter(product => 
    product.product_name?.toLowerCase().includes(search.toLowerCase()) &&
    (sportType === 'all' || product.sport_type === sportType) &&
    (categoryId === 'all' || String(product.category_id) === String(categoryId))
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
          <Grid container spacing={2} alignItems="center">
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
              {/* Sport type selector - primary control */}
              <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                <FormControl variant="standard">
                  <Select
                    value={sportType}
                    onChange={(e) => { setSportType(e.target.value); setCategoryId('all') }}
                    sx={{ minWidth: 160 }}
                  >
                    <MenuItem value="all">All Sports</MenuItem>
                    {sportTypes.map(st => (
                      <MenuItem key={st} value={st}>{st}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            {/* Sport chips row (quick selection) */}
            <Grid item xs={12}>
              <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label="All Sports" clickable color={sportType === 'all' ? 'primary' : 'default'} onClick={() => { setSportType('all'); setCategoryId('all') }} />
                {sportTypes.map(st => (
                  <Chip key={st} label={st} clickable color={sportType === st ? 'primary' : 'default'} onClick={() => { setSportType(st); setCategoryId('all') }} />
                ))}
              </Box>
            </Grid>

            {/* Categories appear only when a sport is selected */}
            {sportType !== 'all' && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Categories for {sportType}</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip label="All Categories" clickable color={categoryId === 'all' ? 'primary' : 'default'} onClick={() => setCategoryId('all')} />
                  {availableCategories.map(cat => (
                    <Chip key={cat.category_id} label={cat.category_name} clickable color={String(categoryId) === String(cat.category_id) ? 'primary' : 'default'} onClick={() => setCategoryId(cat.category_id)} />
                  ))}
                </Box>
              </Grid>
            )}
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
