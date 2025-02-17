"use client";

import { motion } from "framer-motion";
import BigTitle from "./BigTitle";
import BlurryEntrance from "./BlurryEntrance";
import MagneticZone from "./MagneticZone";
import Link from "next/link";
import { Button } from "./ui/button";
import { LucidePopcorn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import FirefliesBackground from "./banner/FirefliesBackground";

const IntroBanner = () => {
  const [randomNumber, setRandomNumber] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    setRandomNumber(Math.floor(Math.random() * 4) + 1);
  }, []);

  // when the component renders the first time, please scroll to the top of the pagfe:

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 80);
  }, [toast]);

  return (
    <div className="overflow-hidden">
      {/* <div className="w-full h-80">
      </div> */}
      <BlurryEntrance delay={0.1}>
        <div className="border-zinc-400 bg-black min-h-80 md:min-h-60 border-2 overflow-hidden p-4 md:py-8 rounded-2xl flex flex-col items-center justify-center relative">
          <div className="absolute inset-0 pointer-events-none">
            <FirefliesBackground />
          </div>
          <div className="absolute inset-0">
            <motion.div
              initial={{ opacity: 0, y: 90, rotate: -10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ duration: 3.5, ease: "easeInOut" }}
              className="w-full h-full rounded-2xl origin-left"
            >
              <MagneticZone hfull factor={170.5}>
                <div
                  className="w-full h-full rounded-2xl scale-105 origin-center"
                  style={{
                    backgroundImage: `url(/images/banner_${randomNumber}.png)`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              </MagneticZone>
            </motion.div>
          </div>

          <div className="absolute flex justify-end items-end right-2 bottom-2 md:right-4 md:bottom-4">
            <motion.div
              //   initial={{ opacity: 0, y: 100, x: 100, scale: 0.5, rotate: 0 }}
              //   animate={{ opacity: 1, y: 60, x: 30, scale: 1, rotate: -20 }}
              //   exit={{ opacity: 0, y: -100 }}
              transition={{ duration: 3.2, delay: 0.2, ease: "easeOut" }}
              className=""
            >
              <Link
                href="https://ethglobal.com/events/agents"
                target="_blank"
                className="bg-white hover:bg-[#d3ffdc] hover:scale-[102%] active:scale-[98%] hover:border-smolGreen 
                duration-100 active:opacity-40 transition-all px-4 pb-1 text-black border-2 
                border-zinc-400 flex flex-col items-center justify-center rounded-lg"
              >
                <img
                  src="/images/eth-global.png"
                  className="w-28 md:w-40 transition-all duration-1000"
                />
                <div className="-translate-y-0.5 flex flex-col items-center justify-center">
                  <div className="text-xs sm:text-sm leading-none font-semibold pt-0">
                    Agentic Hackathon
                  </div>
                  <div className="text-xs sm:text-sm uppercase leading-none tracking-wider opacity-70">
                    February 2025
                  </div>
                </div>
              </Link>
            </motion.div>
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
              <div className="text-xs md:text-sm font-semibold transition-all duration-700 italic">
                an experiment on ai agents + onchain culture
              </div>
            </div>
          </BlurryEntrance>
          <BlurryEntrance delay={0.24}>
            <div className="pt-4 md:pt-8">
              <Link href="/videos/demo-final.mp4" target="_blank">
                <Button
                  variant="outline"
                  // onClick={() => {
                  //   toast({
                  //     title: "Video demo coming soon!",
                  //   });
                  // }}
                >
                  <div className="flex items-center gap-2 px-6">
                    <div className="-translate-y-0.5">
                      <LucidePopcorn />
                    </div>
                    <div>Watch the video demo</div>
                  </div>
                </Button>
              </Link>
            </div>
          </BlurryEntrance>
        </div>
      </BlurryEntrance>
    </div>
  );
};

export default IntroBanner;
