import React, { useState } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'
import { setCustomer } from '../auth'
import { Box, Paper, Tabs, Tab, TextField, Button, Typography, Avatar, Grid, InputAdornment, IconButton } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { Visibility, VisibilityOff } from '@mui/icons-material'

export default function Auth(){
  const [tab, setTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('tab') === '1' ? 1 : 0;
  })
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const navigate = useNavigate()

  const handleTab = (_, v) => setTab(v)

  const signup = async () => {
    try {
      if (!password) {
        alert('Password is required');
        return;
      }
      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      const res = await api.post('/customers', { name, email, password, phone, address })
  const customer = res.data
  setCustomer(customer)
      await handlePostAuthAction(customer)
    } catch (err) {
      console.error(err)
      alert('Signup failed: ' + (err.response?.data?.error || err.message))
    }
  }

  const signin = async () => {
    try {
      if (!password) {
        alert('Password is required');
        return;
      }
      const res = await api.post('/customers/login', { email, password })
  const customer = res.data
  setCustomer(customer)
      await handlePostAuthAction(customer)
    } catch (err) {
      console.error(err)
      alert('Sign in failed: ' + (err.response?.data?.message || err.message))
    }
  }

  const handlePostAuthAction = async (customer) => {
    try {
      const params = new URLSearchParams(window.location.search)
      const action = params.get('action')
      const next = params.get('next')
      if (action === 'add') {
        const product_id = params.get('product_id')
        const quantity = Number(params.get('quantity') || '1')
        if (product_id) {
          await api.post(`/carts/${customer.customer_id}/add`, { product_id, quantity })
          // navigate to cart after adding
          navigate('/cart')
          return
        }
      }
      if (next) { navigate(next); return }
      // default
      navigate('/profile')
    } catch (err) {
      console.error('post auth action failed', err)
      navigate('/profile')
    }
  }

  const onSubmit = (e) => { e.preventDefault(); tab === 0 ? signin() : signup() }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
      <Paper elevation={6} sx={{ width: { xs: '92%', sm: 600 }, p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 1 }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography variant="h6">Welcome</Typography>
              <Typography variant="body2" color="text.secondary">Sign in or create an account to continue</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Tabs value={tab} onChange={handleTab} sx={{ mb: 2 }}>
              <Tab label="Sign in" />
              <Tab label="Sign up" />
            </Tabs>

            <form onSubmit={onSubmit}>
              {tab === 1 && (
                <TextField fullWidth label="Name" value={name} onChange={e=>setName(e.target.value)} sx={{ mb: 2 }} required />
              )}
              <TextField fullWidth label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} sx={{ mb: 2 }} required />
              <TextField 
                fullWidth 
                label="Password" 
                type={showPassword ? "text" : "password"}
                value={password} 
                onChange={e=>setPassword(e.target.value)} 
                sx={{ mb: 2 }} 
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {tab === 1 && (
                <TextField 
                  fullWidth 
                  label="Confirm Password" 
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword} 
                  onChange={e=>setConfirmPassword(e.target.value)} 
                  sx={{ mb: 2 }} 
                  required
                  error={password !== confirmPassword && confirmPassword !== ''}
                  helperText={password !== confirmPassword && confirmPassword !== '' ? "Passwords don't match" : ''}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
              {tab === 1 && (
                <>
                  <TextField fullWidth label="Phone" value={phone} onChange={e=>setPhone(e.target.value)} sx={{ mb: 2 }} />
                  <TextField fullWidth label="Address (optional)" value={address} onChange={e=>setAddress(e.target.value)} sx={{ mb: 2 }} multiline rows={2} />
                </>
              )}

              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Button variant="contained" type="submit">{tab === 0 ? 'Sign in' : 'Create account'}</Button>
                <Button variant="text" onClick={()=> setTab(tab === 0 ? 1 : 0)}>{tab === 0 ? 'Create an account' : 'Have an account? Sign in'}</Button>
              </Box>
            </form>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}
