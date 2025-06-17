import React from 'react'
import { Outlet } from 'react-router-dom'
import UserMenu from '../components/UserMenu'

const UserLayout = () => {
  return (
    <section className="bg-white">
      <div className="container mx-auto p-3 grid lg:grid-cols-[250px,1fr]">
        {/* Left Sidebar for User */}
        <div className="py-4 sticky top-24 max-h-[calc(100vh-96px)] overflow-y-auto hidden lg:block border-r">
          <UserMenu />
        </div>

        {/* Right Content Area */}
        <div className="bg-white min-h-[75vh]">
          <Outlet />
        </div>
      </div>
    </section>
  )
}

export default UserLayout
