"use client";

import React, { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Slide = {
  id: number;
  content: React.ReactNode;
};

type FullPageSliderProps = {
  slides: Slide[];
  page: number;
  direction: number;
  setPage: React.Dispatch<React.SetStateAction<[number, number]>>;
};

const FullPageSlider: React.FC<FullPageSliderProps> = ({
  slides,
  page,
  direction,
  setPage,
}) => {
  // [page, direction]: page es el índice actual, direction indica si vas pa' abajo (1) o pa' arriba (-1)

  const [isAnimating, setIsAnimating] = useState(false);
  const touchStart = useRef<number | null>(null);
  const touchThreshold = 30; // minimum swipe distance

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
    [isAnimating, slides.length, setPage]
  );

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      const now = Date.now();
      const scrollThreshold = 50;
      const timeThreshold = 500; // 0.5 segundo entre scrolls

      if (Math.abs(e.deltaY) < scrollThreshold) return;
      if (
        lastScrollTime.current &&
        now - lastScrollTime.current < timeThreshold
      )
        return;

      lastScrollTime.current = now;

      if (e.deltaY > 0 && page < slides.length - 1) {
        paginate(1);
      } else if (e.deltaY < 0 && page > 0) {
        paginate(-1);
      }
    },
    [page, slides.length, paginate]
  );

  const lastScrollTime = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;

    const touchEnd = e.changedTouches[0].clientY;
    const diff = touchStart.current - touchEnd;

    if (Math.abs(diff) < touchThreshold) return;

    if (diff > 0 && page < slides.length - 1) {
      paginate(1); // Swipe up
    } else if (diff < 0 && page > 0) {
      paginate(-1); // Swipe down
    }

    touchStart.current = null;
  };

  const variants = {
    initial: (direction: number) => ({
      y: direction > 0 ? "50%" : "-50%",
      opacity: 0,
    }),
    animate: {
      y: "0%",
      opacity: 1,
    },
    exit: (direction: number) => ({
      y: direction > 0 ? "-50%" : "50%",
      opacity: 0,
    }),
  };

  if (!slides[page]) return null;

  return (
    <div
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative h-[calc(100vh-120px)] w-full overflow-hidden"
    >
      <AnimatePresence
        // initial={false}
        custom={direction}
        onExitComplete={() => setIsAnimating(false)}
      >
        <motion.div
          // layoutId={`slide-${page}`}
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
