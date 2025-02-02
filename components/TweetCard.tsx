import { RawUser } from "@/lib/types";
import React from "react";

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
        <div className="flex items-center gap-2 w-full">
          <div>
            <img
              className="w-12 rounded-full aspect-square"
              src={twitterProfile.profile_picture}
              alt="profile"
            />
          </div>
          <div>
            <div>{twitterProfile.display_name}</div>
            <div className="font-normal opacity-70 text-sm">
              @{twitterProfile.handle}
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

export default TweetCard;
