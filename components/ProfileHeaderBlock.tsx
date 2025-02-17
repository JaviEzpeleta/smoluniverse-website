"use client";

import { RawUser } from "@/lib/types";
import BlurryEntrance from "./BlurryEntrance";
import Title from "./Title";
import Link from "next/link";
import { Button } from "./ui/button";

const ProfileHeaderBlock = ({
  user,
  lifeContext,
  linkToProfile = false,
}: {
  user: RawUser;
  lifeContext: any;
  linkToProfile?: boolean;
}) => {
  return (
    <div className="flex gap-4 items-center">
      <BlurryEntrance>
        <Link
          href={
            linkToProfile
              ? `/u/${user.handle}`
              : `https://twitter.com/${user.handle}`
          }
          target={linkToProfile ? "_self" : "_blank"}
        >
          <div
            className="rounded-full w-24 h-24 bg-zinc-900 scale-x-[-1] hover:rotate-[3600deg] hover:hue-rotate-180 hover:scale-[103%]"
            style={{
              backgroundImage: `url(${user.profile_picture})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transitionDuration: "3s",
            }}
          />
        </Link>
      </BlurryEntrance>
      <div>
        <BlurryEntrance delay={0.1}>
          <Title>{user.display_name}</Title>
        </BlurryEntrance>
        <BlurryEntrance delay={0.2}>
          <Link
            href={`https://twitter.com/${user.handle}`}
            target="_blank"
            className="text-indigo-400 hover:text-indigo-300 transition-all active:opacity-60"
          >
            <div>@{user.handle}</div>
          </Link>
        </BlurryEntrance>
        <BlurryEntrance delay={0.3}>
          <Link
            href={`/u/${user.handle}/life-context-history`}
            className="hover:text-primary transition-all duration-300 active:scale-95 active:opacity-70"
            // className="text-indigo-400 hover:text-indigo-300 transition-all active:opacity-60"
          >
            {lifeContext.city_name} {lifeContext.country_emoji}{" "}
            <span className="pl-1 opacity-70">
              {lifeContext.relationship_status_code}
            </span>
          </Link>
        </BlurryEntrance>
      </div>
    </div>
  );
};

export default ProfileHeaderBlock;
