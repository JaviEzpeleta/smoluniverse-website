import React from "react";
import { CgSpinnerTwo } from "react-icons/cg";

function DefaultLoadingMini() {
  return (
    <div
      className="w-full max-w-2xl mx-auto flex 
  justify-center flex-col items-center p-12 md:py-20"
    >
      {/* <BlurryEntrance delay={0.2}> */}
      <div className="animate-pulse flex flex-col items-center justify-center gap-4">
        <CgSpinnerTwo className="animate-spin text-4xl text-indigo-300" />
        <div className="text-indigo-300">Loading...</div>
      </div>
      {/* </BlurryEntrance> */}
    </div>
  );
}

export default DefaultLoadingMini;
