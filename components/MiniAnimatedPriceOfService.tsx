"use client";

import { useToast } from "@/hooks/use-toast";
import BlurryEntrance from "./BlurryEntrance";
import MiniTitle from "./MiniTitle";

const MiniAnimatedPriceOfService = ({ price }: { price: string }) => {
  const { toast } = useToast();
  return (
    <div className="absolute bottom-4 right-2 rounded-full group px-4 select-none bg-gradient-to-br from-zinc-900/60 to-zinc-950/80 backdrop-blur-xl">
      <BlurryEntrance delay={0.52}>
        <MiniTitle>
          <div
            className="text-primary/80 group-hover:text-primary transition-colors cursor-pointer group-active:opacity-60"
            onClick={() => {
              toast({
                title: "Only AI clones can buy, sorry!",
              });
            }}
          >
            {price.toLocaleString()}
            <span className="text-sm font-mono text-primary/80 group-hover:text-primary font-bold">
              $
            </span>
            <span className="text-base font-medium">SMOL</span>
          </div>
        </MiniTitle>
      </BlurryEntrance>
    </div>
  );
};

export default MiniAnimatedPriceOfService;
