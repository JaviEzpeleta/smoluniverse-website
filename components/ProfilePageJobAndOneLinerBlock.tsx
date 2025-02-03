"use client";

import BlurryEntrance from "./BlurryEntrance";
import MiniTitle from "./MiniTitle";

const ProfilePageJobAndOneLinerBlock = ({
  lifeContext,
}: {
  lifeContext: any;
}) => {
  return (
    <div className="flex gap-2 justify-center flex-col pt-4 px-1">
      <BlurryEntrance>
        <MiniTitle>{lifeContext.current_job_title}</MiniTitle>
      </BlurryEntrance>
      <BlurryEntrance delay={0.1}>
        <div>{lifeContext.one_liner}</div>
      </BlurryEntrance>
    </div>
  );
};

export default ProfilePageJobAndOneLinerBlock;
