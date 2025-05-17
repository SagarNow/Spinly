import React from 'react'
import Link from 'next/link'
const Navbar = () => {
  return (
    <div className="fixed top-7 w-full z-50 ">
      
    <div className="mx-auto w-[90%] max-w-6xl h-16 
                      backdrop-blur-md bg-white/10 
                      ring-1 ring-white/30
                      border-2 border-white/30
                      text-white rounded-3xl 
                      flex items-center justify-between px-6 shadow-lg shadow-blue-500/10">
    <img className='logo h-11 ml-10 opacity-60' src="/Images/logo.png" alt="logo"  />

      <div className=' gap-10  font-bold text-white w-full flex items-center justify-end mr-20'> 

<Link href="/" className='hover:text-gray-400 duration-200 hover:scale-105'>Home</Link> 
<Link href="/about" className='hover:text-gray-400 duration-200 hover:scale-105'>About</Link>
<Link href="/portfolio" className='hover:text-gray-400 duration-200 hover:scale-105'>Portfolio</Link>
<Link href="/contact" className='hover:text-gray-400 duration-200 hover:scale-105'>Contact</Link>

<div className='ml-15'> <Link href="/login" className='hover:text-gray-400 duration-200 hover:scale-105'>login</Link></div>
      </div>

    </div>
  </div>
  
  )
}

export default Navbar