import { RawUser } from "@/lib/types";
import Link from "next/link";
import BlurryEntrance from "./BlurryEntrance";

const CloneInHomeList = ({
  clone,
  index,
}: {
  clone: RawUser;
  index: number;
}) => {
  console.log(" 💚 💚 💚 💚 💚 💚 💚 CLONE: ", clone);

  return (
    <BlurryEntrance delay={index * 0.05 + 0.2}>
      <Link href={`/u/${clone.handle}`} className="active:opacity-50">
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
      </Link>
    </BlurryEntrance>
  );
};

export default CloneInHomeList;
