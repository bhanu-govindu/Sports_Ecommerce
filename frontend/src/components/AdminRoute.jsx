import React from 'react'
import { Navigate } from 'react-router-dom'
import { getAdmin } from '../auth'

export default function AdminRoute({ children }){
  const admin = getAdmin()
  if (!admin || admin.email !== 'admin@dbms.com') {
    return <Navigate to="/" replace />
  }
  return children
}
