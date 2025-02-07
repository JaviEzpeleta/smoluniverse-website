"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const SmoothScrollSlides = ({ slides }: { slides: string[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const newIndex = Math.floor(scrollY / windowHeight);
    setActiveIndex(Math.min(Math.max(newIndex, 0), slides.length - 1));
  }, [scrollY, windowHeight, slides.length]);

  return (
    <div style={{ overflow: "hidden" }}>
      {slides.map((content, index) => {
        const position = index - activeIndex;
        const opacity = position === 0 ? 1 : 0.5 - Math.abs(position) * 0.5;
        const y = position * windowHeight;

        return (
          <motion.div
            key={index}
            style={{
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
            animate={{
              opacity: opacity,
              y: -y,
              transition: {
                type: "tween",
                duration: 0.5,
                ease: "easeInOut",
              },
            }}
          >
            <div
              style={{
                padding: "20px",
                background: "rgba(255,255,255,0.9)",
                borderRadius: "10px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              }}
            >
              {content}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default SmoothScrollSlides;
