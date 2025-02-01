"use client";

import { RawUser } from "@/lib/types";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { FiTrash2 } from "react-icons/fi";
import { useRouter } from "next/navigation";

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

  console.log(" 💚 💚 💚 💚 💚 💚 💚 CLONE: ", clone);

  const router = useRouter();

  return (
    <motion.div
      style={{ x, background }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 + 0.2 }}
      drag="x"
      dragConstraints={{ left: -200, right: 0 }}
      onDragEnd={(event, info) => {
        if (info.offset.x < -160) {
          onDelete(clone.handle);
        } else {
          x.set(0);
        }
      }}
      className="relative rounded-xl"
    >
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
        onClick={() => router.push(`/u/${clone.handle}`)}
        className="active:opacity-50"
      >
        {/* <Link href={`/u/${clone.handle}`} className="active:opacity-50"> */}
        <div className="bg-zinc-900 border border-zinc-900 hover:border-zinc-700 transition-all duration-150 py-2 px-4 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white/30"
              style={{
                backgroundImage: `url(${clone.profile_picture})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div>
              <div className="text-xl font-bold">{clone.display_name}</div>
              <div className="text-xs text-zinc-400">@{clone.handle}</div>
            </div>
          </div>
        </div>
        {/* </Link> */}
      </div>
    </motion.div>
    // </BlurryEntrance>
  );
};

export default CloneInHomeList;
