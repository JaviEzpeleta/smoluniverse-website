"use client";

import FullPageSlider from "@/components/FullPageSlider";
import HowItWorksSlide1 from "@/components/HowItWorksSlide1";
import HowItWorksSlide2 from "@/components/HowItWorksSlide2";
import { useState } from "react";

const HowItWorks = () => {
  const [[page, direction], setPage] = useState<[number, number]>([0, 0]);
  const slides = [
    {
      id: 1,
      content: <HowItWorksSlide1 />,
    },
    {
      id: 2,
      content: <HowItWorksSlide2 />,
    },
    {
      id: 3,
      content: (
        <div className="h-full bg-blue-500 flex items-center justify-center text-3xl text-white">
          Slide 3
        </div>
      ),
    },
  ];
  return (
    <div className="relative flex justify-center">
      <div className="top-2 absolute w-full bg-zinc-900 p-4 max-w-sm mx-auto rounded-full z-20">
        <div className="flex justify-center gap-4">
          {/* {slides.length} */}
          {/* draw circles for each step */}
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="w-5 h-5 bg-zinc-400 rounded-full hover:bg-slate-300 active:opacity-40 cursor-pointer"
              onClick={() => setPage([slide.id - 1, 0])}
            ></div>
          ))}
        </div>
      </div>
      <FullPageSlider
        slides={slides}
        page={page}
        direction={direction}
        setPage={setPage}
      />
    </div>
  );
};

export default HowItWorks;
