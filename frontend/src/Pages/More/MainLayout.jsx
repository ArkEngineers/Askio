import React from 'react'
import { Outlet } from 'react-router-dom'

function MainLayout() {
  return (
    <div>
        <div className='text-base-3 bg-grey-9 h-screen'>
            <Outlet/>
        </div>
    </div>
  )
}

export default MainLayout