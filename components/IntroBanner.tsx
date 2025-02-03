"use client";

import { motion } from "framer-motion";
import BigTitle from "./BigTitle";
import BlurryEntrance from "./BlurryEntrance";
import Title from "./Title";

const IntroBanner = () => {
  return (
    <div className="overflow-hidden">
      <BlurryEntrance delay={0.1}>
        <div className="border-zinc-400 bg-black min-h-60 border-2 overflow-hidden p-4 py-8 rounded-2xl flex flex-col items-center justify-center relative">
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ duration: 1.5, delay: 0.62, ease: "easeOut" }}
              className="w-full h-full rounded-2xl"
              style={{
                backgroundImage: "url(/images/intro-banner.png)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></motion.div>
          </div>

          {/* // Rainbow disabled for now, i think */}
          {/* <div className="absolute inset-0 flex justify-end items-end pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 100, x: 100, scale: 0.5, rotate: 0 }}
              animate={{ opacity: 1, y: 60, x: 30, scale: 1, rotate: -20 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ duration: 3.2, delay: 0.2, ease: "easeOut" }}
            >
              <div
                className="w-44 h-44 lg:w-60 lg:h-60 transition-all duration-1000"
                style={{
                  backgroundImage: "url(/images/rainbow-sticker.png)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            </motion.div>
          </div> */}
          <BlurryEntrance delay={0.18}>
            <div className="flex flex-col items-center justify-center">
              <BigTitle>
                <div className="transition-all duration-1000">
                  <span className="text-yellow-200">smol</span>
                  <span className="text-smolGreen">universe</span>
                  <span className="text-indigo-200 text-base">.com</span>
                </div>
              </BigTitle>
              <div className="text-xl transition-all duration-700 md:text-4xl">
                welcome!
              </div>
            </div>
          </BlurryEntrance>
          <BlurryEntrance delay={0.24}>something else here?!</BlurryEntrance>
        </div>
      </BlurryEntrance>
    </div>
  );
};

export default IntroBanner;
