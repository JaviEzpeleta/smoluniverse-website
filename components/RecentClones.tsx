"use client";

import { RawUser } from "@/lib/types";
import useStore from "@/lib/zustandStore";
import CloneInHomeList from "./CloneInHomeList";

const RecentClones = () => {
  const { clones } = useStore((state) => state);
  return (
    <div className="flex flex-col gap-4 py-12">
      <div className="text-2xl font-bold">Recent Clones ({clones.length})</div>
      <div className="flex flex-col gap-2">
        {clones.map((clone: RawUser, index: number) => (
          <CloneInHomeList key={clone.handle} index={index} clone={clone} />
        ))}
      </div>
    </div>
  );
};

export default RecentClones;
