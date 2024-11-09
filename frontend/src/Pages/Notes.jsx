import React from 'react'
import { FaSheetPlastic } from "react-icons/fa6";

function Notes() {
  const arr=[1,2,3,4,5]
  return (
    <div className='pt-36 pb-12 pl-20 gap-12 grid place-items-center'>

      <div className='w-1/2'>
        <h1 className='text-2xl font-bold'>Artificial Intelligence</h1>
        {
          arr.map(items=>{
            return(
              <div className='flex border-b border-grey-6 justify-between py-2 items-center'>
                <FaSheetPlastic className='p-2 rounded-lg text-5xl text-grey-6 bg-grey-4'/>
                <h1 className='text-lg text-bold'>Aritification Intelligence Unit 3</h1>
                <p className='text-xs text-grey-1'>9 Nov 2024</p>
              </div>
            )
          })
        }
      </div>
      <div className='w-1/2'>
        <h1 className='text-2xl font-bold'>Software Engineering</h1>
        {
          arr.map(items=>{
            return(
              <div className='flex border-b border-grey-6 justify-between py-2 items-center'>
                <FaSheetPlastic className='p-2 rounded-lg text-5xl text-grey-6 bg-grey-4'/>
                <h1 className='text-lg text-bold'>Aritification Intelligence Unit 3</h1>
                <p className='text-xs text-grey-1'>9 Nov 2024</p>
              </div>
            )
          })
        }
      </div>
      
    </div>
  )
}

export default Notes