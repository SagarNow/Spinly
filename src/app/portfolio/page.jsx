import React from 'react'

const page = () => {
  return (
    <div className='relative overflow-hidden min-h-screen'>

        <video autoPlay loop className='absolute top-0 left-0 w-full h-full object-cover z-0' > <source src="/Videos/fav.mp4" type="video/mp4" /></video>
        <div className="absolute inset-0 bg-blue-900/10 backdrop-blur-sm z-10"></div>
      
        <div className='absolute  min-h-screen px-4 z-10 h-screen w-screen gap-10 flex flex-col items-center justify-center select-none'>
                        <h1 className=" text-6xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent drop-shadow-md text-center opacity-60
">
   {/*  bg-clip-text  means text will be visible only on the background color  hue hue nice sexy */}
{/* drop-shadow-md means shadow will be visible only on the background color */}

                                        <span className="block">Not just a portfolio -_-</span>     
            
                                             <span className="block mt-6">A preview of the future</span>
                  </h1>

                  <span className="text-lg font-bold md:text-2xl text-white/80  ">Coming soon...</span>
        </div>
    </div>
  )
}

export default page