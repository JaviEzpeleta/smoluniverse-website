"use client";

import { RawUser } from "@/lib/types";
import useStore from "@/lib/zustandStore";
import CloneInHomeList from "./CloneInHomeList";
import BlurryEntrance from "./BlurryEntrance";

const RecentClones = () => {
  const { clones } = useStore((state) => state);
  return (
    <div className="flex flex-col gap-4 py-12">
      <BlurryEntrance delay={0.15}>
        <div className="text-2xl font-bold">
          Recent Clones ({clones.length})
        </div>
      </BlurryEntrance>
      <BlurryEntrance delay={0.2}>
        <div className="flex flex-col gap-2">
          {clones.map((clone: RawUser, index: number) => (
            <CloneInHomeList key={clone.handle} index={index} clone={clone} />
          ))}
        </div>
      </BlurryEntrance>
    </div>
  );
};

export default RecentClones;
