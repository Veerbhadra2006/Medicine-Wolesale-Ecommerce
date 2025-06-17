// src/pages/RoleBasedAddress.jsx
import React from 'react'
import { useSelector } from 'react-redux'
import Address from '../pages/Address'
import EarningsReport from '../pages/EarningsReport'

const RoleBasedAddress = () => {
  const user = useSelector(state => state.user)

  if (user?.role === "ADMIN") {
    return <EarningsReport />
  }
  else {
      return <Address />
  }

};

export default RoleBasedAddress
