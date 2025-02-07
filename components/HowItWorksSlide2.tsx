"use client";

import BlurryEntrance from "./BlurryEntrance";
import Title from "./Title";

const HowItWorksSlide2 = () => {
  return (
    <div className="h-full bg-black flex items-center justify-center text-3xl text-white">
      <BlurryEntrance delay={0.63}>
        <Title>welcome to smol universe</Title>
      </BlurryEntrance>
    </div>
  );
};

export default HowItWorksSlide2;
