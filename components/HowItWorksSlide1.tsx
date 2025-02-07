"use client";

import BlurryEntrance from "./BlurryEntrance";
import Title from "./Title";

const HowItWorksSlide1 = () => {
  return (
    <div className="h-full bg-black flex items-center justify-center text-3xl text-white">
      <BlurryEntrance delay={0.33}>
        <Title>welcome to smol universe</Title>
      </BlurryEntrance>
    </div>
  );
};

export default HowItWorksSlide1;
