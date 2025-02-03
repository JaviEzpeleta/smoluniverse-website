import { RawUser } from "@/lib/types";
import React from "react";
import CheckMark from "./svg/CheckMark";
import Link from "next/link";

function TweetCard({
  children,
  twitterProfile,
}: {
  children: React.ReactNode;
  twitterProfile: RawUser;
}) {
  return (
    <div className="bg-gradient-to-br from-zinc-600/40 to-zinc-800/70 p-[1.5px] rounded-[13.5px]">
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 font-sans text-white py-3 px-4 rounded-xl flex flex-col gap-4 pb-6">
        <div className="flex gap-2">
          <div>
            <div
              className="hover:rotate-[3600deg] hover:hue-rotate-180 scale-x-[-1] flip-horizontal hover:scale-150 ease-in-out transition-all"
              style={{ transitionDuration: "3s" }}
            >
              <img
                draggable="false"
                className="w-12 rounded-full aspect-square"
                src={twitterProfile.profile_picture}
                alt="profile"
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                <Link
                  href={`/u/${twitterProfile.handle}`}
                  className="active:opacity-60"
                >
                  <div className="font-bold hover:underline">
                    {twitterProfile.display_name}
                  </div>
                </Link>
                <CheckMark />
              </div>
              <div className="font-medium opacity-70 text-sm">
                @{twitterProfile.handle}
              </div>
              <div className="opacity-70 text-sm">·</div>
              <div className="opacity-70 text-sm">3m ago</div>
            </div>
            <div className="pt-0">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TweetCard;
