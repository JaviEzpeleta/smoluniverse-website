"use client";

import Link from "next/link";
import BlurryEntrance from "./BlurryEntrance";
import { Button } from "./ui/button";

const ExploreLauncher = () => {
  return (
    <BlurryEntrance delay={0.1}>
      <div className="bg-zinc-900 border-zinc-900/50 border-2 mt-4 p-4 pt-6 max-w-md rounded-2xl flex flex-col items-center justify-center">
        <Link href="/explore">
          <Button variant="outline" className="px-8">
            Explore By type of content
          </Button>
        </Link>
      </div>
    </BlurryEntrance>
  );
};

export default ExploreLauncher;
