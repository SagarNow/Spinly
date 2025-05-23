import React from 'react'
import Link from 'next/link'
const Main = () => {
  return (
<div className="min-h-screen bg-gradient-to-br from-[#1e1e2f] via-[#252539] to-[#2c2c44] text-white flex flex-col justify-center items-center px-6 ">
      
      

      {/* Hook */}

      <h2 className="text-4xl md:text-6xl font-bold text-center mb-4 mt-25">
        Too many tasks?<br />Let the wheel decide.
      </h2>

     
      <p className="text-gray-300 max-w-xl text-center mb-8 text-lg ">
        Stop overthinking. Add your tasks, spin the wheel, and let Spinly choose what's next.
      </p>

    
      <div className="flex gap-4 mt-11">
        <Link
          href="/spin"
          className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition"
        >
          Spin Now
        </Link>
        <Link
          href="/about"
          className="px-6 py-3 border border-white/30 hover:bg-white/10 rounded-lg font-medium transition"
        >
          Learn More
        </Link>
      </div> 
      {/* Subtle icon / image */}
{/*       
      <div className="mt-16 opacity-30">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
        </svg>
      </div> */}
    </div>
  )
}

export default Main
