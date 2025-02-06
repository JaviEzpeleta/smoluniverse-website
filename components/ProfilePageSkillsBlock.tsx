"use client";

import ToolTipped from "./ToolTipped";
import MiniTitle from "./MiniTitle";
import BlurryEntrance from "./BlurryEntrance";
import NumberFlow from "@number-flow/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "./ui/button";
import ListOfSkills from "./ListOfSkills";

const ProfilePageSkillsBlock = ({
  skills,
  handle,
}: {
  skills: any;
  handle: string;
}) => {
  return (
    <div className="bg-zinc-900 rounded-lg p-4 px-6 md:max-w-sm w-full">
      <BlurryEntrance>
        <div className="flex justify-between items-center">
          <MiniTitle>Skills</MiniTitle>
          <Link
            href={`/u/${handle}/skills-history`}
            className="text-xs hover:text-primary transition-all duration-300 active:scale-95 active:opacity-70"
          >
            {/* <Button variant="ghost"> */}
            <div>see history</div>
            {/* </Button> */}
          </Link>
        </div>
      </BlurryEntrance>
      <ListOfSkills skills={skills} />
    </div>
  );
};

export default ProfilePageSkillsBlock;
