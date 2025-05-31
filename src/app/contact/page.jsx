import React from "react";
import Link from "next/link";
const page = () => {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-[#1c1c2b] via-[#38385f] to-[#1a1a2e] flex items-center justify-center p-5

"
    >
       <div
        className=" h-115 w-full  flex items-center justify-center flex-col gap-2   backdrop-blur-md bg-[#1c1c2b]
                      
                       border-2 border-white/30
                       text-white rounded-3xl"
      >
        <h1 className="text-[40px] font-bold z-100 flex items-center justify-center">
          {" "}
          Get in Touch
        </h1>


        <div className="grid grid-cols-2 gap-25 z-10 items-center justify-center  ">
          <div className="h-80 w-full ">
            <h1 className="text-[18px] font-extrabold z-100 flex items-center justify-center mt-7">
              {" "}
              Got a project or idea? Let’s connect and make something great
              together.
            </h1>
            <ul className="gap-5 flex flex-col mt-7 ml-7">
              <li>
                Email :{" "}
                <Link
                  href="mailto:sagaronlyy@gmail.com"
                  className="text-blue-400 hover:underline"
                >
                  sagaronlyy@gmail.com
                </Link>
              </li>
              <li>
                linkedin :{" "}
                <Link
                  href="https://www.linkedin.com/in/mrsagarsingh"
                  className="text-blue-400 hover:underline"
                >
                  @Mrsagarsingh
                </Link>
              </li>

              <li>
                github :{" "}
                <Link
                  href="https://github.com/SagarNow"
                  className="text-blue-400 hover:underline"
                >
                  @SagarNow
                </Link>
              </li>
              <li>
                Location :<strong> Nagaur,Rajasthan,India, Earth 🌍</strong>
              </li>
            </ul>
          </div>

          <div className="h-80 w-full  flex justify-center flex-col gap-5 ">
          
          <form action="" className=" flex flex-col gap-5"> 
            <input type="text" placeholder="Your Name" className="border-2 border-white/30 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 duration-200" />
            <input type="email" placeholder="Your Email" className="border-2 border-white/30 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 duration-200" />
            <textarea  rows="4" placeholder="Your Message" className="border-2 border-white/30 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-purple-500 duration-200"></textarea>
            <button type="submit" className="bg-white/20 hover:bg-white/40 duration-200 w-50  py-2 rounded-md">Send Message</button>
          </form>


          
          </div>
        </div>
      </div>

    
 







{/* 
      
  <div className="bg-[#0f0c29] text-white py-16 px-6 md:px-20" id="contact">

    <h2 className="text-4xl font-bold text-center mb-10">Get in Touch</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      
      
      <div>
      <h1 className="text-[18px] font-bold z-100 flex items-center justify-center mt-7">
              {" "}
              Got a project or idea? Let’s connect and make something great
              together.
            </h1>
            <ul className="gap-5 flex flex-col mt-7 ml-7">
              <li>
                Email :{" "}
                <Link
                  href="mailto:sagaronlyy@gmail.com"
                  className="text-blue-400 hover:underline"
                >
                  sagaronlyy@gmail.com
                </Link>
              </li>
              <li>
                linkedin :{" "}
                <Link
                  href="https://www.linkedin.com/in/mrsagarsingh"
                  className="text-blue-400 hover:underline"
                >
                  @Mrsagarsingh
                </Link>
              </li>

              <li>
                github :{" "}
                <Link
                  href="https://github.com/SagarNow"
                  className="text-blue-400 hover:underline"
                >
                  @SagarNow
                </Link>
              </li>
              <li>
                Location :<strong> Nagaur,Rajasthan,India, Earth 🌍</strong>
              </li>
            </ul>
      </div>

     
      <form className="space-y-6">
        <input type="text" placeholder="Your Name" className="w-full px-4 py-3 rounded-md bg-white/10 backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder:text-gray-300" />
        <input type="email" placeholder="Your Email" className="w-full px-4 py-3 rounded-md bg-white/10 backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder:text-gray-300" />
        <textarea rows="4" placeholder="Your Message" className="w-full px-4 py-3 rounded-md bg-white/10 backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder:text-gray-300"></textarea>
        <button type="submit" className="bg-purple-600 hover:bg-purple-700 transition duration-300 text-white font-semibold px-6 py-3 rounded-md">
          Send Message
        </button>
      </form>

    </div>
  </div>  */}



    </div>
  );
};

export default page;
