import React, { useEffect, useState } from 'react'
import api from '../api'
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Avatar,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
  Link
} from '@mui/material'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'

import { getCustomer, clearCustomer, setCustomer } from '../auth'

function initials(name = ''){
  return name.split(' ').map(s=>s[0]).join('').slice(0,2).toUpperCase()
}

export default function Profile(){
  const customer = getCustomer()
  const [data, setData] = useState(customer || { name: '', email: '', phone: '', address: '' })
  const [loading, setLoading] = useState(false)
  const [snack, setSnack] = useState({ open: false, severity: 'success', message: '' })
  const [editing, setEditing] = useState(false)
  const [original, setOriginal] = useState(null)

  useEffect(()=>{
    if (!customer) return
    const load = async () => {
      try {
        const res = await api.get(`/customers/${customer.customer_id}`)
        setData(res.data)
      } catch (err) { console.error(err); setSnack({ open: true, severity: 'error', message: 'Failed to load profile' }) }
    }
    load()
  }, [])

  const save = async () => {
    if (!data.name || !data.email) { setSnack({ open: true, severity: 'warning', message: 'Name and email are required' }); return }
    try {
      setLoading(true)
      const res = await api.put(`/customers/${customer.customer_id}`, {
        name: data.name, email: data.email, phone: data.phone, address: data.address
      })
  setData(res.data)
  setCustomer(res.data)
      setSnack({ open: true, severity: 'success', message: 'Profile updated' })
      setEditing(false)
    } catch (err) { console.error(err); setSnack({ open: true, severity: 'error', message: 'Could not update profile' }) }
    finally { setLoading(false) }
  }

  if (!customer) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Paper elevation={3} sx={{ width: { xs: '92%', sm: 450 }, p: 4, textAlign: 'center' }}>
        <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', mx: 'auto', mb: 2 }}>
          <PersonOutlineIcon sx={{ fontSize: 40 }} />
        </Avatar>
        <Typography variant="h5" sx={{ mb: 2 }}>Sign in Required</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Please sign in to view and manage your profile
        </Typography>
        <Button
          variant="contained"
          size="large"
          href="/auth"
          sx={{ width: '100%', mb: 2 }}
        >
          Sign In
        </Button>
        <Typography variant="body2" color="text.secondary">
          Don't have an account?{' '}
          <Link href="/auth?tab=1" color="primary" sx={{ textDecoration: 'none' }}>
            Create one now
          </Link>
        </Typography>
      </Paper>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
      <Paper sx={{ width: { xs: '92%', sm: 820 }, p: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4} sx={{ textAlign: 'center' }}>
            <Avatar sx={{ width: 96, height: 96, bgcolor: 'primary.main', mx: 'auto', mb: 2 }}>{initials(data?.name)}</Avatar>
            <Typography variant="h6">{data?.name || 'User'}</Typography>
            <Typography variant="body2" color="text.secondary">Manage your account details</Typography>
          </Grid>

          <Grid item xs={12} sm={8}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Profile</Typography>
              {!editing ? (
                <Box>
                  <Button size="small" onClick={() => { setOriginal(data); setEditing(true) }}>Edit</Button>
                </Box>
              ) : (
                <Box>
                  <Button size="small" color="primary" onClick={save} disabled={loading} startIcon={loading ? <CircularProgress size={18} /> : null}>Save</Button>
                  <Button size="small" onClick={() => { setData(original || data); setEditing(false) }} sx={{ ml: 1 }}>Cancel</Button>
                </Box>
              )}
            </Box>

            <TextField fullWidth label="Name" value={data?.name || ''} onChange={e=>setData({...data, name: e.target.value})} sx={{ mb: 2 }} InputProps={{ readOnly: !editing }} />
            <TextField fullWidth label="Email" value={data?.email || ''} onChange={e=>setData({...data, email: e.target.value})} sx={{ mb: 2 }} InputProps={{ readOnly: !editing }} />
            <TextField fullWidth label="Phone" value={data?.phone || ''} onChange={e=>setData({...data, phone: e.target.value})} sx={{ mb: 2 }} InputProps={{ readOnly: !editing }} />
            <TextField fullWidth label="Address" value={data?.address || ''} onChange={e=>setData({...data, address: e.target.value})} sx={{ mb: 2 }} multiline rows={3} InputProps={{ readOnly: !editing }} />

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Button variant="outlined" onClick={() => { clearCustomer(); window.location.href = '/' }}>Sign out</Button>
            </Box>
          </Grid>
        </Grid>

        <Snackbar open={snack.open} autoHideDuration={3500} onClose={()=>setSnack(s=>({...s, open:false}))}>
          <Alert severity={snack.severity} sx={{ width: '100%' }}>{snack.message}</Alert>
        </Snackbar>
      </Paper>
    </Box>
  )
}
