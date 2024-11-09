import React from 'react'
import { Outlet } from 'react-router-dom'

function MainLayout() {
  return (
    <div>
        <div className='bg-black h-screen text-grey-5'>
            <Outlet/>
        </div>
    </div>
  )
}

export default MainLayout