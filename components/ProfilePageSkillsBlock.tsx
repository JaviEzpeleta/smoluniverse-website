"use client";

import ToolTipped from "./ToolTipped";
import MiniTitle from "./MiniTitle";
import BlurryEntrance from "./BlurryEntrance";
import NumberFlow from "@number-flow/react";
import { motion } from "framer-motion";

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
          ) => {
            let gradientColor =
              "bg-gradient-to-r from-smolGreen/40 to-smolGreen";
            if (Number(level) < 80) {
              gradientColor =
                "bg-gradient-to-r from-yellow-400/40 to-yellow-400";
            }
            if (Number(level) < 60) {
              gradientColor = "bg-gradient-to-r from-amber-400/40 to-amber-400";
            }
            if (Number(level) < 40) {
              gradientColor =
                "bg-gradient-to-r from-orange-400/40 to-orange-400";
            }
            if (Number(level) < 20) {
              gradientColor = "bg-gradient-to-r from-red-400/40 to-red-400";
            }
            return (
              <ToolTipped text={description} key={index}>
                <div className="relative overflow-hidden rounded-md">
                  <BlurryEntrance delay={index * 0.055 + 0.12}>
                    <div className="bg-zinc-800 p-2 pb-1 flex items-center gap-2 justify-between">
                      <div className="flex items-center gap-2">
                        <div>{emoji}</div>
                        <div>{name}</div>
                      </div>
                      <NumberFlow value={Number(level)} />
                    </div>
                    <div className="absolute rounded-xl bottom-0 w-full pointer-events-none h-0.5 bg-zinc-950">
                      <motion.div
                        className={`h-0.5 rounded-xl ${gradientColor}`}
                        initial={{ width: 0 }}
                        animate={{
                          width: `${level}%`,
                        }}
                        transition={{
                          duration: 1.2,
                          ease: "easeOut",
                        }}
                      ></motion.div>
                    </div>
                  </BlurryEntrance>
                </div>
              </ToolTipped>
            );
          }
        )}
      </div>
    </div>
  );
};

export default ProfilePageSkillsBlock;
