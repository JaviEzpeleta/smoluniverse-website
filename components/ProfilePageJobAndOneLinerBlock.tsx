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
        <MiniTitle>
          <div className="text-balance">{lifeContext.current_job_title}</div>
        </MiniTitle>
      </BlurryEntrance>
      <BlurryEntrance delay={0.1}>
        <div className="text-balance">{lifeContext.one_liner}</div>
      </BlurryEntrance>
    </div>
  );
};

export default ProfilePageJobAndOneLinerBlock;
