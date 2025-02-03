"use client";

import BlurryEntrance from "./BlurryEntrance";
import MiniTitle from "./MiniTitle";
import { MarkdownRenderer } from "./MarkdownRenderer";

const ProfilePageLifeGoalsBlock = ({ lifeGoals }: { lifeGoals: any }) => {
  return (
    <div className="bg-zinc-900 rounded-lg p-4 px-6 flex-1">
      <BlurryEntrance>
        <MiniTitle>Life Goals</MiniTitle>
      </BlurryEntrance>
      <BlurryEntrance delay={0.1}>
        <MarkdownRenderer>{lifeGoals}</MarkdownRenderer>
      </BlurryEntrance>
    </div>
  );
};

export default ProfilePageLifeGoalsBlock;
