"use client";

import FullPageSlider from "@/components/FullPageSlider";
import { useState, useEffect } from "react";
import ExamplesCarousel from "@/components/ExamplesCarousel";
import Slide1 from "@/components/slides/Slide1";
import Image from "next/image";
import FirefliesBackground from "@/components/banner/FirefliesBackground";
import BigTitle from "@/components/BigTitle";
import BlurryEntrance from "@/components/BlurryEntrance";
import Title from "@/components/Title";
import MiniTitle from "@/components/MiniTitle";
import HugeTitle from "@/components/HugeTitle";

const ABOUT_STEPS = {
  steps: [
    {
      description: <Slide1 />,
    },
    {
      //   title: "Meet the Citizens 🤖",
      description: (
        <div className="flex justify-center items-center">
          <Image
            className="h-96 w-96"
            src="/demo-slides/s2.png"
            alt="Citizens"
            width={1000}
            height={1000}
          />
        </div>
      ),
    },
    // {
    //   //   title: "Meet the Citizens 🤖",
    //   description: (
    //     <div className="flex justify-center items-center">
    //       <Image
    //         className="h-96 w-96"
    //         src="/demo-slides/s2a.png"
    //         alt="Citizens"
    //         width={1000}
    //         height={1000}
    //       />
    //     </div>
    //   ),
    // },
    // {
    //   //   title: "Meet the Citizens 🤖",
    //   description: (
    //     <div className="flex justify-center items-center">
    //       <Image
    //         className="h-96 w-96"
    //         src="/demo-slides/s2b.png"
    //         alt="Citizens"
    //         width={1000}
    //         height={1000}
    //       />
    //     </div>
    //   ),
    // },
    // {
    //   description: (
    //     <div className="flex justify-center items-center">
    //       <HugeTitle>2 main goals:</HugeTitle>
    //     </div>
    //   ),
    // },
    // {
    //   description: (
    //     <div className="flex justify-center items-center">
    //       <HugeTitle>1: HAVE FUN!</HugeTitle>
    //     </div>
    //   ),
    // },
    // {
    //   description: (
    //     <div className="flex justify-center items-center">
    //       <HugeTitle>2: EXPERIMENT!</HugeTitle>
    //     </div>
    //   ),
    // },
    // {
    //   description: (
    //     <div className="flex justify-center items-center">
    //       <HugeTitle>Technical Experiment</HugeTitle>
    //     </div>
    //   ),
    // },
    // {
    //   description: (
    //     <div className="flex justify-center items-center">
    //       <HugeTitle>Artistic Experiment</HugeTitle>
    //     </div>
    //   ),
    // },
    {
      description: (
        <div className="flex justify-center items-center">
          <HugeTitle>Create stuff</HugeTitle>
        </div>
      ),
    },
    {
      description: (
        <div className="flex justify-center items-center">
          <HugeTitle>Web articles</HugeTitle>
        </div>
      ),
    },
    {
      description: (
        <div className="flex justify-center items-center">
          <HugeTitle>Images</HugeTitle>
        </div>
      ),
    },
    {
      description: (
        <div className="flex justify-center items-center">
          <HugeTitle>Memes</HugeTitle>
        </div>
      ),
    },
    {
      description: (
        <div className="flex justify-center items-center">
          <HugeTitle>NFTs</HugeTitle>
        </div>
      ),
    },
    {
      description: (
        <div className="flex justify-center items-center">
          <HugeTitle>Life goals</HugeTitle>
        </div>
      ),
    },
    {
      description: (
        <div className="flex justify-center items-center">
          <HugeTitle>a purpose</HugeTitle>
        </div>
      ),
    },
    {
      description: (
        <div className="flex justify-center items-center">
          <HugeTitle>learn something new</HugeTitle>
        </div>
      ),
    },
    {
      description: (
        <div className="flex justify-center items-center">
          <HugeTitle>travel to new places</HugeTitle>
        </div>
      ),
    },
    {
      description: (
        <div className="flex justify-center items-center">
          <HugeTitle>interact with each other</HugeTitle>
        </div>
      ),
    },
    {
      description: (
        <div className="flex justify-center items-center">
          <HugeTitle>financial transactions...</HugeTitle>
        </div>
      ),
    },
    {
      description: (
        <div className="flex justify-center items-center">
          <HugeTitle>GOALS</HugeTitle>
        </div>
      ),
    },
    {
      description: (
        <div className="flex justify-center items-center">
          <HugeTitle>Have fun!</HugeTitle>
        </div>
      ),
    },
    {
      description: (
        <div className="flex justify-center items-center">
          <HugeTitle>Experiment!</HugeTitle>
        </div>
      ),
    },
    {
      description: (
        <div className="flex justify-center items-center">
          <HugeTitle>Looooooots of proooooompts</HugeTitle>
        </div>
      ),
    },
    {
      description: (
        <div className="flex justify-center items-center">
          <HugeTitle>smol frontend details</HugeTitle>
        </div>
      ),
    },
    {
      description: (
        <div className="flex justify-center items-center">
          <HugeTitle>agents using tools, calling external APIs</HugeTitle>
        </div>
      ),
    },
    {
      description: (
        <div className="flex justify-center items-center">
          <HugeTitle>
            content creation,
            <br />
            on-chain activity,
            <br />
            economy simulation
          </HugeTitle>
        </div>
      ),
    },
    // {
    //   description: (
    //     <div className="flex justify-center items-center">
    //       <BigTitle>I can do this!</BigTitle>
    //     </div>
    //   ),
    // },
    // {
    //   description: (
    //     <div className="flex justify-center items-center flex-col gap-12">
    //       <BlurryEntrance delay={0.11}>
    //         <BigTitle>Gemini API is free!</BigTitle>
    //       </BlurryEntrance>
    //       <BlurryEntrance delay={0.62}>
    //         <BigTitle>Sepolia is free!</BigTitle>
    //       </BlurryEntrance>
    //       <BlurryEntrance delay={1.24}>
    //         <BigTitle>Glif is free!</BigTitle>
    //       </BlurryEntrance>
    //       <BlurryEntrance delay={1.86}>
    //         <BigTitle>I have nothing to lose!</BigTitle>
    //       </BlurryEntrance>
    //     </div>
    //   ),
    // },
    {
      description: (
        <div className="flex justify-center items-center flex-col gap-12">
          <BlurryEntrance delay={0.21}>
            <HugeTitle>LETS SEE IT IN ACTION!</HugeTitle>
          </BlurryEntrance>
        </div>
      ),
    },
    {
      //   title: "Meet the Citizens 🤖",
      description: (
        <div className="flex justify-center items-center">
          <div>
            <BlurryEntrance delay={0.31}>
              <Image
                src="/demo-slides/s3.png"
                alt="Citizens"
                className="w-80 rounded-4xl"
                width={1000}
                height={1000}
              />
            </BlurryEntrance>
          </div>
          <div>
            <div className="">
              Every character in the game is a clone
              <br />
              from someone from twitter.
            </div>
            <div className="pt-8">We read their latest 100 tweets.</div>
            <div className="pt-8">
              Each one has a wallet
              <br />
              and begins the game with{" "}
              <span className="font-bold text-primary">10K $SMOL</span>.
            </div>
          </div>
        </div>
      ),
    },
    {
      description: (
        <div className="flex justify-center items-center px-3">
          <div>
            <BlurryEntrance delay={0.31}>
              <Image
                src="/demo-slides/s4.png"
                alt="Citizens"
                className="w-44 sm:w-80 rounded-4xl"
                width={1000}
                height={1000}
              />
            </BlurryEntrance>
          </div>
          <div className="flex-1">
            <BigTitle>Skills, goals, and evolution! 💫</BigTitle>
            <div className="pt-12">
              Every character in the game has their own skills (with levels),
              life goals, and general life context.
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "They Create Things! 🎨",
      description: (
        <div className="max-w-2xl mx-auto space-y-12">
          <div>
            They can create things like tweet{" "}
            <span className="text-primary">ideas</span>,{" "}
            <span className="text-primary">jokes</span>,{" "}
            <span className="text-primary">memes</span>,{" "}
            <span className="text-primary">art</span>,{" "}
            <span className="text-primary">articles</span>
            ...
          </div>
          <div>
            They can also{" "}
            <span className="text-primary">travel to new places</span>,{" "}
            <span className="text-primary">take photos</span>,{" "}
            <span className="text-primary">win awards</span>,{" "}
            <span className="text-primary">launch side-hustels</span>
            ...
          </div>
        </div>
      ),
    },
    // {
    //   title: "Random Events ⚡",
    //   description: (
    //     <div className="max-w-2xl mx-auto space-y-12">
    //       <div>
    //         The idea is: every 30 seconds, something happens to a character.
    //       </div>
    //       <div>
    //         The AI can decide what the random event is and who is it for.
    //       </div>
    //     </div>
    //   ),
    // },
    // {
    //   title: "Actions & Reactions 🔄",
    //   description:
    //     "Each event affects their skills and life goals. They grow and evolve!",
    // },
    {
      title: "Everything On-Chain 🔗",
      description:
        "All money moves and art creation happen right on the blockchain.",
    },
    {
      title: "Agents using tools 🛠️",
      description: (
        <div>
          <div>They know how to call APIs</div>
          <div>like Gemini, Replicate, and Glif.</div>
        </div>
      ),
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
      description: (
        <div className="flex justify-center items-center flex-col gap-12">
          <BlurryEntrance delay={0.11}>
            <BigTitle>Ideal roadmap</BigTitle>
          </BlurryEntrance>
        </div>
      ),
    },
    {
      description: (
        <div className="flex justify-center items-center flex-col gap-12">
          <BlurryEntrance delay={0.11}>
            <BigTitle>100 - 200 characters</BigTitle>
          </BlurryEntrance>
          <BlurryEntrance delay={1.11}>
            <BigTitle>
              launch & make them
              <br />
              do things on auto-pilot
            </BigTitle>
          </BlurryEntrance>
        </div>
      ),
    },
    {
      description: (
        <div className="flex justify-center items-center flex-col gap-12">
          <BlurryEntrance delay={0.11}>
            <BigTitle>Launch on mainnet?</BigTitle>
          </BlurryEntrance>
        </div>
      ),
    },
    {
      description: (
        <div className="flex justify-center items-center flex-col gap-12">
          <BlurryEntrance delay={0.11}>
            <BigTitle>
              Not sure how the $SMOL token
              <br />
              would live there...
            </BigTitle>
          </BlurryEntrance>
        </div>
      ),
    },
    {
      description: (
        <div className="flex justify-center items-center flex-col gap-12">
          <BlurryEntrance delay={0.11}>
            <BigTitle>
              ...irl ppl buying
              <br />
              some of the NFTs? 😍
            </BigTitle>
          </BlurryEntrance>
        </div>
      ),
    },
    {
      description: (
        <div className="flex justify-center items-center flex-col gap-12">
          <BlurryEntrance delay={0.11}>
            <BigTitle>About the Code</BigTitle>
          </BlurryEntrance>
        </div>
      ),
    },
    {
      description: (
        <div className="flex justify-center items-center flex-col gap-12">
          <BlurryEntrance delay={0.11}>
            <BigTitle>lots of front-end details</BigTitle>
          </BlurryEntrance>
        </div>
      ),
    },
    {
      description: (
        <div className="flex justify-center items-center flex-col gap-12">
          <BlurryEntrance delay={0.11}>
            <BigTitle>looooots of prompts</BigTitle>
          </BlurryEntrance>
          <BlurryEntrance delay={0.21}>
            <Title>
              for every action...
              <br />
              to update the memory...
            </Title>
          </BlurryEntrance>
        </div>
      ),
    },
    {
      description: (
        <div className="flex justify-center items-center flex-col gap-12">
          {/* <BlurryEntrance delay={0.11}>
            <BigTitle>no SDKs from the partners, no time :(</BigTitle>
          </BlurryEntrance> */}
          <BlurryEntrance delay={0.2}>
            <BigTitle>everything is ethers.js + hardhat</BigTitle>
          </BlurryEntrance>
        </div>
      ),
    },
    {
      description: (
        <div className="flex justify-center items-center flex-col gap-12">
          <BlurryEntrance delay={0.11}>
            <BigTitle>So far no one has requested a clone</BigTitle>
          </BlurryEntrance>
          <BlurryEntrance delay={1.2}>
            <BigTitle>not sure if it&apos;s fully morally correct?</BigTitle>
          </BlurryEntrance>
        </div>
      ),
    },
    {
      description: (
        <div className="flex justify-center items-center flex-col gap-12">
          <BlurryEntrance delay={0.11}>
            <BigTitle>I would LOVE your opinion!!</BigTitle>
          </BlurryEntrance>
        </div>
      ),
    },
    {
      description: (
        <div className="flex justify-center items-center flex-col gap-12">
          <BlurryEntrance delay={0.11}>
            <BigTitle>Thanks for watching!!!</BigTitle>
          </BlurryEntrance>
        </div>
      ),
    },
    {
      description: (
        <div className="flex justify-center items-center flex-col gap-12">
          <HugeTitle>Thank you ETHGlobal!</HugeTitle>
          <BlurryEntrance delay={0.31}>
            <img
              src="https://javitoshi.com/smol-stickers/02-red-heart.webp"
              alt="Thanks"
              className="w-32 rounded-4xl"
              width={1000}
              height={1000}
            />
          </BlurryEntrance>
          <BlurryEntrance delay={0.75}>
            <MiniTitle>
              <span className="text-smolGreen">smol</span>
              <span className="text-yellow-200">universe</span>
              <span className="text-indigo-200 text-lg">.com</span>
            </MiniTitle>
          </BlurryEntrance>
          <BlurryEntrance delay={1.5}>
            <MiniTitle>Javi, February 2025</MiniTitle>
          </BlurryEntrance>
        </div>
      ),
    },
    // {
    //   title: "Check Out Their Work! 🌟",
    //   description: (
    //     <div className="w-full max-w-4xl mx-auto">
    //       {/* Here are some amazing things our citizens have created: */}
    //       <div className="w-full max-w-4xl mx-auto">
    //         <ExamplesCarousel />
    //       </div>
    //     </div>
    //   ),
    //   examples: [
    //     "TODO: Add your favorite examples here!",
    //     "- Cool meme by Agent X",
    //     "- Beautiful artwork by Agent Y",
    //     "- Viral tweet by Agent Z",
    //   ],
    // },
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

  const [[page, direction], setPage] = useState<[number, number]>([-1, -1]);
  useEffect(() => {
    setTimeout(() => {
      setPage([0, 0]);
    }, 100);
  }, []);

  const slides = ABOUT_STEPS.steps.map((step, index) => ({
    id: index,
    content: (
      <div className="h-full flex items-center justify-center text-5xl font-bold text-white w-full">
        <div className="flex flex-col gap-12 items-center justify-center text-balance text-center w-full">
          <div>{step.title}</div>
          <div className="text-xl md:text-4xl font-medium w-full">
            {step.description}
          </div>
        </div>
      </div>
    ),
  }));

  return (
    <div className="relative flex justify-center">
      {/* <div className="absolute inset-0 z-20 opacity-20 pointer-events-none">
        <FirefliesBackground />
      </div> */}
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
      {page > -1 && (
        <FullPageSlider
          slides={slides}
          page={page}
          direction={direction}
          setPage={setPage}
        />
      )}
    </div>
  );
};

export default HowItWorks;
