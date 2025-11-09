import React, { useState, useEffect } from 'react'
import { Box, Paper, Tabs, Tab, TextField, Button, Typography, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material'
import { Add, Edit, Delete, Warning } from '@mui/icons-material'
import api from '../api'

export default function Admin(){
  const [tab, setTab] = useState(0)
  const [product, setProduct] = useState({ product_name: '', price: '', sport_type: '', brand: '', image_url: '', description: '', stock_quantity: '' })
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [orderDetail, setOrderDetail] = useState(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [message, setMessage] = useState(null)
  const [reviewsList, setReviewsList] = useState([])
  const [feedbacksList, setFeedbacksList] = useState([])
  const [isAddingNew, setIsAddingNew] = useState(true)
  const [stockIncrement, setStockIncrement] = useState({})
  const [editingProduct, setEditingProduct] = useState(null)
  const [showImagePreview, setShowImagePreview] = useState(false)
  const [imagePreviewUrl, setImagePreviewUrl] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)

  useEffect(()=>{ if (tab === 0) fetchProducts() }, [tab])
  useEffect(()=>{ if (tab === 1) fetchOrders() }, [tab])
  useEffect(()=>{ if (tab === 2) { fetchReviews(); fetchFeedbacks(); } }, [tab])

  const handleTab = (_, v) => setTab(v)

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products')
      setProducts(res.data || [])
    } catch (err) {
      console.error(err)
      setMessage({ type: 'error', text: 'Failed to fetch products' })
      setTimeout(()=>setMessage(null), 4000)
    }
  }

  const handleProductChange = (field) => (e) => setProduct(prev => ({ ...prev, [field]: e.target.value }))

  const handleStockIncrement = (productId) => (e) => setStockIncrement(prev => ({ ...prev, [productId]: Number(e.target.value) || 0 }))

  const optimizeImageUrl = (url) => {
    try {
      const urlObj = new URL(url);
      // Handle common image CDNs and add optimization parameters
      if (urlObj.host.includes('pexels.com')) {
        // Pexels: Add compression and resize parameters
        urlObj.searchParams.set('auto', 'compress');
        urlObj.searchParams.set('cs', 'tinysrgb');
        urlObj.searchParams.set('w', '800'); // Reasonable product image width
        return urlObj.toString();
      }
      if (urlObj.host.includes('cloudinary.com')) {
        // Cloudinary: Add optimization parameters
        return url.replace('/upload/', '/upload/w_800,q_auto,f_auto/');
      }
      if (urlObj.host.includes('imgix.net')) {
        // ImgIX: Add optimization parameters
        urlObj.searchParams.set('auto', 'compress');
        urlObj.searchParams.set('w', '800');
        return urlObj.toString();
      }
      // For other URLs, return as is
      return url;
    } catch (e) {
      console.warn('Invalid URL:', url);
      return url;
    }
  }

  const validateAndPreviewImage = async (url) => {
    if (!url) return false;
    try {
      const response = await fetch(url);
      const contentType = response.headers.get('content-type');
      if (!contentType.startsWith('image/')) {
        setMessage({ type: 'error', text: 'URL does not point to a valid image' });
        return false;
      }
      return true;
    } catch (err) {
      setMessage({ type: 'error', text: 'Could not validate image URL' });
      return false;
    }
  }

  const submitProduct = async () => {
    try {
      if (!product.product_name || !product.price || !product.stock_quantity) {
        setMessage({ type: 'error', text: 'Please fill in required fields: Name, Price, Quantity' })
        setTimeout(()=>setMessage(null), 4000)
        return
      }

      // Validate and optimize image URL if provided
      let optimizedImageUrl = product.image_url;
      if (product.image_url) {
        const isValid = await validateAndPreviewImage(product.image_url);
        if (!isValid) return;
        optimizedImageUrl = optimizeImageUrl(product.image_url);
      }

      const payload = { 
        ...product, 
        price: Number(product.price), 
        stock_quantity: Number(product.stock_quantity),
        image_url: optimizedImageUrl
      }

      if (editingProduct) {
        // Update existing product
        await api.put(`/products/${editingProduct.product_id}`, payload);
        setMessage({ type: 'success', text: 'Product updated successfully' });
      } else {
        // Add new product
        const res = await api.post('/products', payload);
        setMessage({ type: 'success', text: 'Product added successfully' });
      }

      setProduct({ product_name: '', price: '', sport_type: '', brand: '', image_url: '', description: '', stock_quantity: '' });
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      console.error('Error:', err);
      const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message || 'Unknown error';
      setMessage({ type: 'error', text: `Failed to ${editingProduct ? 'update' : 'add'} product: ${errorMsg}` });
    }
    setTimeout(()=>setMessage(null), 5000);
  }

  const increaseStock = async (productId) => {
    const qty = stockIncrement[productId]
    if (!qty || qty <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid quantity' })
      setTimeout(()=>setMessage(null), 3000)
      return
    }
    try {
      const prod = products.find(p => p.product_id === productId)
      if (!prod) return
      const newStock = (prod.stock_quantity || 0) + qty
      await api.put(`/products/${productId}`, { 
        product_name: prod.product_name,
        description: prod.description,
        price: prod.price,
        stock_quantity: newStock,
        sport_type: prod.sport_type,
        brand: prod.brand,
        category_id: prod.category_id,
        supplier_id: prod.supplier_id
      })
      setMessage({ type: 'success', text: `Stock increased by ${qty}` })
      setStockIncrement(prev => ({ ...prev, [productId]: 0 }))
      fetchProducts()
    } catch (err) {
      console.error(err)
      setMessage({ type: 'error', text: 'Failed to increase stock: ' + (err.response?.data?.error || err.message) })
    }
    setTimeout(()=>setMessage(null), 3000)
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
          <>
            {/* Toggle between Add New and Increase Stock */}
            <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
              <Button 
                variant={isAddingNew ? "contained" : "outlined"} 
                onClick={() => setIsAddingNew(true)}
              >
                Add New Product
              </Button>
              <Button 
                variant={!isAddingNew ? "contained" : "outlined"} 
                onClick={() => setIsAddingNew(false)}
              >
                Increase Stock
              </Button>
            </Box>

            {isAddingNew ? (
              // Add/Edit Product Form
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField 
                    fullWidth 
                    label="Product Name *" 
                    value={product.product_name} 
                    onChange={handleProductChange('product_name')} 
                    sx={{ mb: 2 }} 
                    required 
                  />
                  <TextField 
                    fullWidth 
                    label="Price *" 
                    type="number" 
                    value={product.price} 
                    onChange={handleProductChange('price')} 
                    sx={{ mb: 2 }} 
                    required 
                  />
                  <TextField 
                    fullWidth 
                    label="Stock Quantity *" 
                    type="number" 
                    value={product.stock_quantity} 
                    onChange={handleProductChange('stock_quantity')} 
                    sx={{ mb: 2 }} 
                    required 
                  />
                  <TextField 
                    fullWidth 
                    label="Sport Type" 
                    value={product.sport_type} 
                    onChange={handleProductChange('sport_type')} 
                    sx={{ mb: 2 }} 
                    placeholder="e.g., Football, Basketball" 
                  />
                  <TextField 
                    fullWidth 
                    label="Brand" 
                    value={product.brand} 
                    onChange={handleProductChange('brand')} 
                    sx={{ mb: 2 }} 
                  />
                  <Box sx={{ mb: 2 }}>
                    <TextField 
                      fullWidth 
                      label="Image URL" 
                      value={product.image_url} 
                      onChange={(e) => {
                        handleProductChange('image_url')(e);
                        if (e.target.value) {
                          validateAndPreviewImage(e.target.value).then(isValid => {
                            if (isValid) {
                              setImagePreviewUrl(optimizeImageUrl(e.target.value));
                              setShowImagePreview(true);
                            }
                          });
                        } else {
                          setShowImagePreview(false);
                        }
                      }}
                    />
                    {showImagePreview && imagePreviewUrl && (
                      <Box sx={{ mt: 1, position: 'relative' }}>
                        <img 
                          src={imagePreviewUrl} 
                          alt="Preview" 
                          style={{ 
                            maxWidth: '100%', 
                            height: 'auto', 
                            maxHeight: '200px',
                            objectFit: 'contain',
                            borderRadius: '4px'
                          }} 
                        />
                      </Box>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField 
                    fullWidth 
                    label="Description" 
                    value={product.description} 
                    onChange={handleProductChange('description')} 
                    sx={{ mb: 2 }} 
                    multiline 
                    rows={8} 
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button 
                      variant="contained" 
                      onClick={submitProduct}
                    >
                      {editingProduct ? 'Update Product' : 'Add Product'}
                    </Button>
                    {editingProduct && (
                      <Button 
                        variant="outlined" 
                        onClick={() => {
                          setEditingProduct(null);
                          setProduct({ product_name: '', price: '', sport_type: '', brand: '', image_url: '', description: '', stock_quantity: '' });
                          setShowImagePreview(false);
                        }}
                      >
                        Cancel Edit
                      </Button>
                    )}
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                    Fields marked with * are required
                  </Typography>
                </Grid>
              </Grid>
            ) : (
              // Increase Stock List
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>Existing Products - Increase Stock</Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell><strong>Product Name</strong></TableCell>
                        <TableCell align="right"><strong>Current Stock</strong></TableCell>
                        <TableCell align="center"><strong>Price</strong></TableCell>
                        <TableCell align="center"><strong>Sport Type</strong></TableCell>
                        <TableCell align="center"><strong>Add Quantity</strong></TableCell>
                        <TableCell align="center"><strong>Action</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {products.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                            <Typography color="text.secondary">No products found</Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        products.map(prod => (
                          <TableRow key={prod.product_id}>
                            <TableCell>{prod.product_name}</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>{prod.stock_quantity || 0}</TableCell>
                            <TableCell align="center">₹{prod.price}</TableCell>
                            <TableCell align="center">{prod.sport_type || '-'}</TableCell>
                            <TableCell align="center">
                              <TextField
                                type="number"
                                size="small"
                                inputProps={{ min: 0, style: { textAlign: 'center', width: 70 } }}
                                value={stockIncrement[prod.product_id] || ''}
                                onChange={handleStockIncrement(prod.product_id)}
                              />
                            </TableCell>
                            <TableCell align="center" sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                              <Button
                                size="small"
                                variant="contained"
                                color="primary"
                                startIcon={<Add />}
                                onClick={() => increaseStock(prod.product_id)}
                              >
                                Add
                              </Button>
                              <Box sx={{ display: 'flex', gap: 0.5 }}>
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => {
                                    setProduct(prod);
                                    setEditingProduct(prod);
                                    setIsAddingNew(true);
                                    if (prod.image_url) {
                                      setImagePreviewUrl(prod.image_url);
                                      setShowImagePreview(true);
                                    }
                                  }}
                                >
                                  <Edit />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => {
                                    setProductToDelete(prod);
                                    setDeleteDialogOpen(true);
                                  }}
                                >
                                  <Delete />
                                </IconButton>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </>
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

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: 400
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Warning color="warning" />
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{productToDelete?.product_name}"?
            This action cannot be undone.
          </Typography>
          {productToDelete?.stock_quantity > 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Warning: This product has {productToDelete.stock_quantity} items in stock
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="error"
            onClick={async () => {
              try {
                await api.delete(`/products/${productToDelete.product_id}`);
                setMessage({ type: 'success', text: 'Product deleted successfully' });
                fetchProducts();
                setDeleteDialogOpen(false);
                setProductToDelete(null);
              } catch (err) {
                console.error('Error deleting product:', err);
                setMessage({ 
                  type: 'error', 
                  text: 'Failed to delete product: ' + (err.response?.data?.error || err.message)
                });
              }
              setTimeout(() => setMessage(null), 5000);
            }}
          >
            Delete Product
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
