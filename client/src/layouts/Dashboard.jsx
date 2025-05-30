import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AdminLayout from './AdminLayout'
import UserLayout from './UserLayout'

import { useSelector } from "react-redux";

const Dashboard = () => {
  const user = useSelector((state) => state.user);

  if (user?.role === "ADMIN") {
    return <AdminLayout />;
  } else {
    return <UserLayout />;
  }
};

export default Dashboard
