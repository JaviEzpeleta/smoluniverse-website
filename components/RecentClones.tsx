"use client";

import { RawUser } from "@/lib/types";
import useStore from "@/lib/zustandStore";
import CloneInHomeList from "./CloneInHomeList";
import BlurryEntrance from "./BlurryEntrance";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { IS_LOCALHOST } from "@/lib/constants";

const RecentClones = () => {
  const { clones, setClones, fetchPusherIndex, setFetchPusherIndex } = useStore(
    (state) => state
  );

  const { setShowWaitlistModal } = useStore((state) => state);

  const { toast } = useToast();

  const onDelete = async (handle: string) => {
    if (!IS_LOCALHOST) {
      setShowWaitlistModal(true);
      return;
    }
    const newClones = clones.filter((clone) => clone.handle !== handle);
    setClones(newClones);
    console.log(" 💚 💚 💚 💚 💚 💚 💚 DELETE: ", handle);
    await axios.post("/api/users/delete", { handle });
    setFetchPusherIndex(fetchPusherIndex + 1);
    toast({
      title: `Clone of ${handle} deleted!`,
      variant: "success",
    });
  };

  return (
    <div className="flex flex-col gap-4 py-12 sticky top-0">
      <BlurryEntrance delay={0.15}>
        <div className="text-2xl font-bold">
          Recent Clones ({clones.length})
        </div>
      </BlurryEntrance>
      <BlurryEntrance delay={0.2}>
        <div className="flex flex-wrap gap-2">
          {clones.map((clone: RawUser, index: number) => (
            <CloneInHomeList
              key={clone.handle}
              index={index}
              clone={clone}
              onDelete={onDelete}
            />
          ))}
        </div>
      </BlurryEntrance>
    </div>
  );
};

export default RecentClones;
