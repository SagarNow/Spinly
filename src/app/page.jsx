import React from "react";

const page = () => {
  return (
    <div className="min-h-screen min-w-screen relative">
        <video
          autoPlay
          muted
          loop
          className="absolute w-full h-full object-cover"
      >
        <source src="/Videos/SpinnerBgVdo.mp4" type="video/mp4" />
      </video>
      
    </div>
  );
};

export default page;
