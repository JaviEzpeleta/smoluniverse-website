"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import BlurryEntrance from "./BlurryEntrance";
import {
  BASESCAN_URL,
  ERC20_TOKEN_CONTRACT_ADDRESS,
  OPENSEA_NFT_COLLECTION_URL,
} from "@/lib/constants";
import useStore from "@/lib/zustandStore";
import { FaXTwitter } from "react-icons/fa6";

const Header = () => {
  const { logoImageIndex, setLogoImageIndex } = useStore((state) => state);
  const ERC20TokenContractAddress = `${BASESCAN_URL}/token/${ERC20_TOKEN_CONTRACT_ADDRESS}`;
  return (
    <div className="flex justify-between items-center p-4">
      <BlurryEntrance>
        <Link href="/">
          <Button
            className="group flex items-center gap-1 pb-2 active:scale-[98%] active:translate-y-1 duration-75"
            variant="ghost"
          >
            <div className="group-hover:rotate-[360deg] transition-all duration-300 ease-in-out group-hover:scale-[1.1] group-active:scale-[0.9] group-active:rotate-[180deg]">
              <img
                src={`/images/logo_${logoImageIndex}.png`}
                alt="Smol Universe"
                className="w-8 h-8"
              />
            </div>
            <div className="text-2xl tracking-tighter translate-y-0.5 font-bold">
              Smol Universe{" "}
              <span className="opacity-0 transition-all duration-300 ease-in-out">
                {logoImageIndex}
              </span>
            </div>
          </Button>
        </Link>
      </BlurryEntrance>
      <div className="flex items-center gap-2">
        <BlurryEntrance delay={0.08}>
          <Link
            href="https://twitter.com/_smoluniverse"
            target="_blank"
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100
          active:opacity-40 group text-sm sm:text-xl
        transition-all duration-100 w-8 sm:w-10 h-8 sm:h-10
        p-0.5 rounded-full flex items-center justify-center gap-3 h-10"
          >
            <FaXTwitter />
            {/* <Image
            src="/images/opensea-logo.svg"
            alt="OpenSea"
            className="bg-white group-hover:scale-[112%] group-hover:rotate-[360deg]
                ease-in-out group-active:scale-95 group-active:rotate-0
                transition-all duration-500 rounded-full p-[1px] -translate-y-[2.6px]"
            width={26}
            height={26}
          /> */}
          </Link>
        </BlurryEntrance>
        <div className="hidden md:flex items-center gap-2">
          <BlurryEntrance delay={0.05}>
            <Link
              href={ERC20TokenContractAddress}
              draggable={false}
              target="_blank"
              className="active:scale-[98%] active:translate-y-0.5 duration-75 block group"
            >
              <div className="bg-zinc-800 hover:bg-zinc-700 hover:text-zinc-50 transition-all duration-150 active:opacity-40 text-zinc-200 font-bold rounded-full p-1.5 pr-3 flex items-center justify-center gap-2">
                <Image
                  src="/images/etherscan-logo.png"
                  alt="Etherscan"
                  className="bg-white rounded-full p-[1px] group-hover:rotate-[360deg] transition-all duration-300 ease-in-out group-hover:scale-[1.1] group-active:scale-[0.9] group-active:rotate-[180deg]"
                  width={26}
                  height={26}
                />
                <div className="translate-y-0.5">$SMOL ERC20</div>
              </div>
            </Link>
          </BlurryEntrance>
          <BlurryEntrance delay={0.05}>
            <Link
              href={OPENSEA_NFT_COLLECTION_URL}
              draggable={false}
              target="_blank"
              className="active:scale-[98%] active:translate-y-0.5 duration-75 block group"
            >
              <div className="bg-zinc-800 hover:bg-zinc-700 hover:text-zinc-50 transition-all duration-150 active:opacity-40 text-zinc-200 font-bold rounded-full p-1.5 pr-3 flex items-center justify-center gap-2">
                <Image
                  src="/images/opensea-logo.svg"
                  alt="Etherscan"
                  className="bg-white rounded-full p-[1px] group-hover:rotate-[360deg] transition-all duration-300 ease-in-out group-hover:scale-[1.1] group-active:scale-[0.9] group-active:rotate-[180deg]"
                  width={26}
                  height={26}
                />
                <div className="translate-y-0.5">NFTs</div>
              </div>
            </Link>
          </BlurryEntrance>
          <BlurryEntrance delay={0.05}>
            <Link
              href={"/how-it-works"}
              draggable={false}
              className="active:scale-[98%] active:translate-y-0.5 duration-75 block group"
            >
              <div className="bg-zinc-800 hover:bg-zinc-700 hover:text-zinc-50 transition-all duration-150 active:opacity-40 text-zinc-200 font-bold rounded-full p-1.5 pr-3 flex items-center justify-center gap-2">
                <Image
                  src="/images/question-mark.png"
                  alt="Etherscan"
                  className="bg-indigo-200 rounded-full p-[1px] group-hover:rotate-[360deg] transition-all duration-300 ease-in-out group-hover:scale-[1.1] group-active:scale-[0.9] group-active:rotate-[180deg]"
                  width={26}
                  height={26}
                />
                <div className="translate-y-0.5 text-indigo-200">
                  HOW IT WORKS?
                </div>
              </div>
            </Link>
          </BlurryEntrance>
        </div>
      </div>
    </div>
  );
};

export default Header;
