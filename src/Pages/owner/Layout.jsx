import React from 'react'
import Navbarowner from '../../Components/owner/Navbarowner'
import Sidebar from '../../Components/owner/Sidebar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className='flex flex-col'>
     <Navbarowner/>
     <div className='flex'>
      <Sidebar/>
      <Outlet/>
     </div>
    </div>
  )
}

export default Layout