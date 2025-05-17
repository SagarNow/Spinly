import React from 'react'
const Main = () => {
  return (
    <div className="min-h-screen relative  bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white ">
        <video
          autoPlay
          muted
          loop
          className="absolute w-full h-full object-cover"
      >
        {/* <source src="/Videos/SpinnerBgVdo.mp4" type="video/mp4" /> */}
      </video>
      
     
  
    </div>
  )
}

export default Main