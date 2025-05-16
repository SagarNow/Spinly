import React from 'react'

const page = () => {
    return (
        <div className=" relative bg-gray-700 min-h-screen text-white overflow-hidden" >
            <video
          autoPlay
          muted
          loop
          className=" absolute top-0 left-0 w-full h-full object-cover z-0 opacity-50"
      >
        <source src="/Videos/AboutBg.mp4" type="video/mp4" />
      </video>
      <div className='relative z-10 flex flex-col items-center justify-center min-h-screen px-4'>
      <h1 className="text-4xl font-bold mb-4">About Us</h1>
      </div>
        </div>
      );
    }

export default page