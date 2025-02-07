"use client";

import FullPageSlider from "@/components/FullPageSlider";
import { useState, useEffect } from "react";
import ExamplesCarousel from "@/components/ExamplesCarousel";
import FirefliesBackground from "@/components/banner/FirefliesBackground";

const ABOUT_STEPS = {
  steps: [
    {
      title: "Welcome to SmolUniverse! 👋",
      description: (
        <div>
          A virtual world made of clones,
          <div>just to experiment</div>
        </div>
      ),
    },
    {
      title: "Meet the Citizens 🤖",
      description: (
        <div>
          <div>
            Every citizen is a clone
            <br />
            from someone from twitter.
          </div>
          <div className="pt-8">
            And they have one wallet each,
            <br />
            with some money to spend in thegame
          </div>
        </div>
      ),
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
      description: "sePOORlia?",
    },
    {
      title: "Check Out Their Work! 🌟",
      description: (
        <div className="w-full max-w-4xl mx-auto">
          {/* Here are some amazing things our citizens have created: */}
          <div className="w-full max-w-4xl mx-auto">
            <ExamplesCarousel />
          </div>
        </div>
      ),
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
  useEffect(() => {
    // Guardar el overflow original
    const originalStyle = window.getComputedStyle(document.body).overflow;
    // Deshabilitar scroll
    document.body.style.overflow = "hidden";

    // Cleanup: restaurar el overflow original cuando el componente se desmonte
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const [[page, direction], setPage] = useState<[number, number]>([0, 0]);
  const slides = ABOUT_STEPS.steps.map((step, index) => ({
    id: index,
    content: (
      <div className="h-full bg-black flex items-center justify-center text-5xl font-bold text-white w-full">
        <div className="flex flex-col gap-12 items-center justify-center text-balance text-center w-full">
          <div>{step.title}</div>
          <div className="text-4xl font-medium w-full">{step.description}</div>
        </div>
      </div>
    ),
  }));

  return (
    <div className="relative flex justify-center">
      <div className="absolute inset-0 z-20 opacity-20 pointer-events-none">
        <FirefliesBackground />
      </div>
      <div className="top-2 absolute w-full bg-zinc-800/40 backdrop-blur-sm p-5 max-w-sm mx-auto rounded-full z-20">
        <div className="flex justify-center">
          {/* {slides.length} */}
          {/* draw circles for each step */}
          <div className="flex bg-zinc-800 rounded-full overflow-hidden">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`w-5 scale-105 hover:scale-125 active:scale-90 h-3 hover:z-20 rounded-none shadow-xl 
                    transition-all duration-300 active:opacity-40 cursor-pointer ${
                      index <= page
                        ? "bg-smolGreen z-10 shadow-smolGreen/60 hover:bg-smolGreen/80"
                        : "bg-zinc-800 hover:bg-zinc-700 shadow-transparent"
                    }`}
                onClick={() =>
                  setPage([
                    index,
                    slide.id > page ? 1 : slide.id < page ? -1 : 0,
                  ])
                }
              ></div>
            ))}
          </div>
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
