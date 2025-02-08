"use client";

import { motion } from "framer-motion";
import BigTitle from "../BigTitle";
import BlurryEntrance from "../BlurryEntrance";
import { useEffect, useState } from "react";

const Slide1 = () => {
  const [showBgImage, setShowBgImage] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowBgImage(true);
    }, 1000);
  }, []);

  return (
    <div className="relative">
      {showBgImage && (
        <div className="fixed inset-0 pointer-events-none -z-10">
          <BlurryEntrance
            // key="intro1"
            className="h-full w-full"
            // initial={{ opacity: 0 }}
            // animate={{ opacity: 1 }}
            // transition={{ delay: 4 }}
          >
            <div
              className="h-full w-full opacity-20"
              style={{
                backgroundImage: `url("/demo-slides/s1.png")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
          </BlurryEntrance>
        </div>
      )}
      <div className="text-8xl font-bold">smoluniverse</div>
      <div>is virtual world made of clones,</div>
      <div>just to experiment</div>
    </div>
  );
};

export default Slide1;
