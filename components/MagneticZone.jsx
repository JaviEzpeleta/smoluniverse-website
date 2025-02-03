import React, { useRef, useState } from "react";
import { useSpring, animated, easings } from "@react-spring/web";

export default function MagneticZone({ children, factor = 1, hfull = false }) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const style = useSpring({
    from: { x: 0, y: 0 },
    to: { ...position },
    config: {
      mass: 0.1,
      damping: 15,
      easing: easings.easeInBounce,
      stiffness: 150,
    },
  });

  const handleMouse = (event) => {
    if (ref.current) {
      const { clientX, clientY } = event;
      const { height, width, left, top } = ref.current.getBoundingClientRect();
      const middleX = clientX - (left + width / 2);
      const middleY = clientY - (top + height / 2);
      setPosition({ x: middleX / factor, y: middleY / factor / 0.7 });
    }
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <animated.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={style}
      className={`${hfull ? "h-full w-full" : ""}`}
    >
      {children}
    </animated.div>
  );
}
