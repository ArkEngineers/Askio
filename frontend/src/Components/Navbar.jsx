import { Avatar } from '@material-tailwind/react';
import React from 'react'
import { FiMenu } from "react-icons/fi";
import { SlOptions } from "react-icons/sl";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useAuth } from '../Context/AuthContext';
function Navbar() {
  const {user}=useAuth();
  console.log(user)
  return (
    <div className='fixed top-0 w-full text-base-2 bg-grey-9 py-4 flex justify-between px-12 items-center border-b border-gray-800'>
      <div className='flex gap-4 items-center'>
      <FiMenu className='text-xl cursor-pointer'/>
      <div className='flex justify-between items-center'>
        <h1 className='font-bold text-xl text-base-1'>Askio</h1>
        <MdOutlineKeyboardArrowRight className='text-2xl text-base-1 cursor-pointer'/>
        <div>
        <h1 className='text-2xl '>Classroom Name</h1>
        <p className='text-grey-1 text-sm'>Mridul Tiwari</p>
        </div>
      </div>
      </div>
      <div className='flex gap-4 items-center'>
        <SlOptions className='text-xl cursor-pointer'/>
        <Avatar size='sm' src={user.image} alt="avatar" />
      </div>
    </div>
  )
}

export default Navbar