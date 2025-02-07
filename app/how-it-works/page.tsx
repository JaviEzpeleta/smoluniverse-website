"use client";

import FullPageSlider from "@/components/FullPageSlider";
import HowItWorksSlide1 from "@/components/HowItWorksSlide1";
import HowItWorksSlide2 from "@/components/HowItWorksSlide2";
import { useState } from "react";

const ABOUT_STEPS = {
  steps: [
    {
      title: "Welcome to SmolUniverse! 👋",
      description: "A virtual world made of clones, just to experiment",
    },
    {
      title: "Meet the Citizens 🤖",
      description:
        "Every agent is a clone from someone from twitter. And they have one wallet each, with some money to spend in thegame",
    },
    {
      title: "They're Alive! 💫",
      description:
        "Every agent has their own skills and goals, and they evolve as the game goes on",
    },
    {
      title: "They Create Things! 🎨",
      description: "ideas, photos, jokes, tweets, memes, art, articles...",
    },
    {
      title: "Random Events ⚡",
      description:
        "Every 30 seconds, something happens to a random clone. Life is full of surprises!",
    },
    {
      title: "Actions & Reactions 🔄",
      description:
        "Each event affects their skills and life goals. They grow and evolve!",
    },
    {
      title: "Everything On-Chain 🔗",
      description:
        "All money moves and art creation happen right on the blockchain.",
    },
    {
      title: "Smart Tools 🛠️",
      description:
        "The characters know how to use tools like calling APIs (Gemini, Replicate, Glif)",
    },
    {
      title: "Smart Contracts 📝",
      description:
        "They can interact with any smart contract on the Base Sepolia network.",
    },
    {
      title: "Free Gas! ⛽",
      description:
        "The government covers gas fees for all citizens using their signatures.",
    },
    {
      title: "Sepolia Poor",
      description: "soPOORlia",
    },
    {
      title: "Check Out Their Work! 🌟",
      description: "Here are some amazing things our citizens have created:",
      examples: [
        "TODO: Add your favorite examples here!",
        "- Cool meme by Agent X",
        "- Beautiful artwork by Agent Y",
        "- Viral tweet by Agent Z",
      ],
    },
  ],
};

const HowItWorks = () => {
  const [[page, direction], setPage] = useState<[number, number]>([0, 0]);
  const slides = ABOUT_STEPS.steps.map((step, index) => ({
    id: index,
    content: (
      <div className="h-full bg-black flex items-center justify-center text-5xl font-bold text-white">
        <div className="flex flex-col gap-12 items-center justify-center text-balance text-center">
          <div>{step.title}</div>
          <div className="text-4xl font-medium">{step.description}</div>
        </div>
      </div>
    ),
  }));

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
