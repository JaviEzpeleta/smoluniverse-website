"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import BlurryEntrance from "./BlurryEntrance";
import { ERC20_TOKEN_CONTRACT_ADDRESS } from "@/lib/constants";

const Header = () => {
  const ERC20TokenContractAddress = `https://sepolia.basescan.org/token/${ERC20_TOKEN_CONTRACT_ADDRESS}`;
  return (
    <div className="flex justify-between items-center p-4">
      <BlurryEntrance>
        <Link href="/">
          <Button
            className="group flex items-center gap-1 pb-2 active:scale-[98%] active:translate-y-1 duration-75"
            variant="ghost"
          >
            <div className="group-hover:rotate-[360deg] transition-all duration-300 ease-in-out group-hover:scale-[1.1] group-active:scale-[0.9] group-active:rotate-[180deg]">
              <Image
                src="/logo.png"
                alt="Smol Universe"
                width={32}
                height={32}
              />
            </div>
            <div className="text-2xl tracking-tighter translate-y-0.5 font-bold">
              Smol Universe
            </div>
          </Button>
        </Link>
      </BlurryEntrance>
      <div className="hidden md:block">
        <BlurryEntrance delay={0.05}>
          <Link
            href={ERC20TokenContractAddress}
            draggable={false}
            target="_blank"
            className="active:scale-[98%] active:translate-y-0.5 duration-75 block"
          >
            <div className="bg-zinc-800 hover:bg-zinc-700 hover:text-zinc-50 transition-all duration-150 active:opacity-40 text-zinc-200 font-bold rounded-full p-1.5 pr-3 flex items-center justify-center gap-2">
              <Image
                src="/images/etherscan-logo.png"
                alt="Etherscan"
                className="bg-white rounded-full p-[1px]"
                width={26}
                height={26}
              />
              <div className="translate-y-0.5">$SMOL Contract</div>
            </div>
          </Link>
        </BlurryEntrance>
      </div>
    </div>
  );
};

export default Header;
