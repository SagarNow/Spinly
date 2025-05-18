import React from 'react'
import Link from 'next/link'
const Main = () => {
  return (
    <div className="min-h-screen relative bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white 
    
    flex
    flex-col
    items-center
    justify-center

    ">
        <div className='z-10 gap-5 flex flex-col items-center justify-center'>
   <h1 className=' opacity-40  text-[100px] font-bold z-100'> Kyon nahi ho rhi <span className='text-[#00fff7]'>padhai?</span></h1>
   <h1 className=' opacity-40  text-[20px] underline decoration-[#00fff7] decoration-2'>Too many tasks, not enough focus? Don’t overthink it.Add your tasks, spin the wheel, and let it decide what to do next. Just take the first step</h1>
   </div>
<div className='mt-30'>
   <Link href="/" className="mt-5 px-10 py-2 border-3  hover:scale-105  duration-200 border-white/30 rounded-2xl bg-white/20 hover:bg-white/40 duration-200 hover:scale-105 z-100  ">Get Started</Link>
   </div>

     <h1 className=' absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[200px] opacity-1 font-bold z-10 select-none flex '>Spinly</h1>
  
     
     
  
    </div>
  )
}

export default Main



