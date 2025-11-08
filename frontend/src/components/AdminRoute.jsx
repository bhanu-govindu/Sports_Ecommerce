import React from 'react'
import { Navigate } from 'react-router-dom'
import { getCustomer } from '../auth'

export default function AdminRoute({ children }){
  const customer = getCustomer()
  if (!customer || customer.email !== 'admin@dbms.com') {
    return <Navigate to="/" replace />
  }
  return children
}
