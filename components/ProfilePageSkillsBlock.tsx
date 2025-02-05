"use client";

import ToolTipped from "./ToolTipped";
import MiniTitle from "./MiniTitle";
import BlurryEntrance from "./BlurryEntrance";
import NumberFlow from "@number-flow/react";

const ProfilePageSkillsBlock = ({ skills }: { skills: any }) => {
  return (
    <div className="bg-zinc-900 rounded-lg p-4 px-6 md:max-w-sm w-full">
      <BlurryEntrance>
        <MiniTitle>Skills</MiniTitle>
      </BlurryEntrance>
      <div className="flex flex-col gap-2 pt-2">
        {skills.map(
          (
            {
              emoji,
              name,
              level,
              description,
            }: {
              emoji: string;
              name: string;
              level: string;
              description: string;
            },
            index: number
          ) => (
            <ToolTipped text={description} key={index}>
              <BlurryEntrance delay={index * 0.055 + 0.12}>
                <div className="bg-zinc-800 rounded-lg p-2 pb-1 flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <div>{emoji}</div>
                    <div>{name}</div>
                  </div>
                  <NumberFlow value={Number(level)} />
                </div>
              </BlurryEntrance>
            </ToolTipped>
          )
        )}
      </div>
    </div>
  );
};

export default ProfilePageSkillsBlock;
