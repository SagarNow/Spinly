import React from 'react'

const page = () => {
    return (
  <div className=" relative bg-gradient-to-tr from-[#0f2027] via-[#203a43] to-[#2c5364]
                  overflow-hidden" >
         
      <div className='relative z-10 flex flex-col items-center justify-center min-h-screen px-4'>
     
         <div className="grid grid-cols-2 gap-25 z-10 items-center justify-center  ">
                    <img className=' h-100 w-120 text-white border-5 border-white/30  rounded-3xl' src="../Images/Lofi-img.jpg" alt="img" />
                    <div className=' h-100 w-120 text-white rounded-2xl gap-5 flex '> 
                    <ul className=" h-100 w-120  list-disc space-y-3 pl-5 text-lg leading-relaxed flex flex-col items-center justify-center ">
                      <h1 className='text-[40px] font-bold z-100 flex items-center justify-center'>About</h1>
  <li><strong>Spinly</strong> is a tool that helps you break free from overthinking and procrastination.</li>
  <li>Enter your tasks, spin the wheel, and let it decide what to start — no more decision stress.</li>
  <li>Designed with focus-friendly colors and a clean UI to keep you calm and motivated.</li>
  <li>Removes choice paralysis and builds momentum — because starting is everything.</li>
  <li>Created by <strong> Sagar </strong>, inspired by real struggles with focus and productivity.</li>
</ul>

 </div>
            



      </div>
      </div>

    
        </div>
      );
    }

export default page