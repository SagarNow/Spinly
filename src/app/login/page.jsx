import React from "react";

const page = () => {
  return (
    <div
      className="min-h-screen bg-gradient-to-tr from-[#0f2027] via-[#203a43] to-[#2c5364]
 shadow-inner shadow-[#ffffff1a] backdrop-blur-md
   flex items-center justify-center "
    >
      <form
        className="h-110 w-89 flex items-center justify-center flex-col gap-2  fixed z-50 *: backdrop-blur-md bg-white/3
                       ring-1 ring-white/30
                       border-2 border-white/30
                       text-white rounded-3xl"
      >
        <h1 className="text-[30px] font-bold mb-10 text-white ">Login</h1>

<div className="flex flex-col gap-7">
        <input className="p-2 rounded-2xl border-2 border-white/30" type="text" placeholder="Username" />
        <input className="p-2 rounded-2xl border-2 border-white/30" type="password" placeholder="Password" />
        </div>
        <button className="mt-5 px-10 py-2 rounded-2xl bg-white/20 hover:bg-white/40 duration-200 ">Login</button>
      </form>

    </div>
  );
};

export default page;
