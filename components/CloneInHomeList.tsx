"use client";

import { RawUser } from "@/lib/types";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { FiTrash2 } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import BlurryEntrance from "./BlurryEntrance";
import MiniTitle from "./MiniTitle";
import { BsWallet2 } from "react-icons/bs";
import { friendlyNumber } from "@/lib/numbers";
import NumberFlow from "@number-flow/react";
import { extractEmojiFromText } from "@/lib/strings";

const CloneInHomeList = ({
  clone,
  index,
  onDelete,
}: {
  clone: RawUser;
  index: number;
  onDelete: (handle: string) => void;
}) => {
  const x = useMotionValue(0);
  const background = useTransform(
    x,
    [-200, 0],
    ["rgba(239, 68, 68, 0.7)", "rgba(255, 255, 255, 0)"]
  );
  const deleteOpacity = useTransform(x, [-200, -100, -20], [1, 0.5, 0]);
  const [isDragging, setIsDragging] = useState(false);

  //   console.log(" 💚 💚 💚 💚 💚 💚 💚 CLONE: ", clone);

  const lifeContact = JSON.parse(clone.life_context);

  const contryEmoji = lifeContact.country_emoji;
  const cityName = lifeContact.city_name;
  const router = useRouter();

  return (
    <motion.div
      style={{ x, background }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 + 0.2 }}
      drag="x"
      dragConstraints={{ left: -200, right: 0 }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(event, info) => {
        setIsDragging(false);
        if (info.offset.x < -160) {
          onDelete(clone.handle);
        } else {
          x.set(0);
        }
      }}
      className="relative rounded-xl cursor-grab active:cursor-grabbing w-full"
    >
      {/* <pre>{JSON.stringify(lifeContact, null, 2)}</pre> */}
      <motion.div
        className="absolute right-2 text-white pointer-events-none h-full flex items-center"
        style={{ opacity: deleteOpacity }}
      >
        <div className="p-2 text-red-500 z-20 bg-black/60 backdrop-blur-md rounded-md flex items-center justify-center gap-2 px-3">
          <div className="text-xs font-semibold">Delete</div>
          <FiTrash2 size={20} />
        </div>
      </motion.div>

      <div
        onClick={() => !isDragging && router.push(`/u/${clone.handle}`)}
        className="active:opacity-50"
      >
        {/* <Link href={`/u/${clone.handle}`} className="active:opacity-50"> */}
        <div className="bg-zinc-900 border border-zinc-900 hover:border-zinc-700 transition-all duration-150 py-2 px-4 rounded-lg flex items-center justify-between w-full">
          <div className="flex items-center gap-3 w-full">
            <div className="relative">
              <div className="absolute -left-1 -bottom-1 z-20 leading-none text-lg font-semibold">
                <div>{contryEmoji}</div>
                {/* <span className="text-[8px]">$</span>
                <NumberFlow
                  // value={Number(friendlyNumber(Number(clone.balance)))}
                  value={Number(clone.balance)}
                /> */}
              </div>
              <div
                className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center border-2 border-zinc-700 scale-x-[-1] hover:rotate-[3600deg] hover:scale-105 hover:hue-rotate-180"
                style={{
                  backgroundImage: `url(${clone.profile_picture})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  transitionDuration: "3s",
                }}
              />
            </div>
            <div className="w-full">
              <div className="text-xl font-bold translate-y-1">
                {clone.display_name}
              </div>
              <div className="flex items-center gap-3 text-base font-bold text-zinc-400 w-full justify-between">
                <div className="text-sm font-medium">@{clone.handle}</div>
                <div className="hidden lg:block">
                  <NumberFlow value={Number(clone.balance)} />
                  <span className="font-mono font-medium text-sm pl-[1px]">
                    $
                  </span>
                  <span className="text-sm font-light">SMOL</span>
                </div>
              </div>
            </div>
            {/* <div className="w-24 flex justify-end">
              {clone.balance && (
                <BlurryEntrance delay={0.15}>
                  <div className="rounded-full flex items-center gap-2">
                    <div className="text-base">
                      <span className="font-mono text-sm font-medium">$</span>
                      {friendlyNumber(Number(clone.balance))}
                      <span className="text-xs pl-1">SMOL</span>
                    </div>
                  </div>
                </BlurryEntrance>
              )}
            </div> */}
          </div>
        </div>
        {/* </Link> */}
      </div>
    </motion.div>
    // </BlurryEntrance>
  );
};

export default CloneInHomeList;
