"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Slide = {
  id: number;
  content: React.ReactNode;
};

type FullPageSliderProps = {
  slides: Slide[];
};

const FullPageSlider: React.FC<FullPageSliderProps> = ({ slides }) => {
  // [page, direction]: page es el índice actual, direction indica si vas pa' abajo (1) o pa' arriba (-1)
  const [[page, direction], setPage] = useState<[number, number]>([0, 0]);
  const [isAnimating, setIsAnimating] = useState(false);

  const paginate = useCallback(
    (newDirection: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setPage(([prevPage]) => {
        let newPage = prevPage + newDirection;
        // Evitamos salirse del array, coño
        if (newPage < 0) newPage = 0;
        if (newPage >= slides.length) newPage = slides.length - 1;
        return [newPage, newDirection];
      });
    },
    [isAnimating, slides.length]
  );

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (e.deltaY > 0 && page < slides.length - 1) {
        // Scroll pa' abajo
        paginate(1);
      } else if (e.deltaY < 0 && page > 0) {
        // Scroll pa' arriba
        paginate(-1);
      }
    },
    [page, slides.length, paginate]
  );

  const variants = {
    initial: (direction: number) => ({
      y: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    animate: {
      y: "0%",
      opacity: 1,
      transition: { duration: 0.8, ease: "easeInOut" },
    },
    exit: (direction: number) => ({
      y: direction > 0 ? "-100%" : "100%",
      opacity: 0,
      transition: { duration: 0.8, ease: "easeInOut" },
    }),
  };

  return (
    <div
      onWheel={handleWheel}
      className="relative h-screen w-full overflow-hidden"
    >
      <AnimatePresence
        initial={false}
        custom={direction}
        onExitComplete={() => setIsAnimating(false)}
      >
        <motion.div
          key={page}
          custom={direction}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute inset-0"
        >
          {slides[page].content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default FullPageSlider;
