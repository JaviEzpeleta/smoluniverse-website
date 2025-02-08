"use client";

import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import ListOfSkills from "./ListOfSkills";

export default function SkillsToggle({
  oldSkills,
  newSkills,
}: {
  oldSkills: any;
  newSkills: any;
}) {
  const [showPrevious, setShowPrevious] = useState(false);

  return (
    <div>
      <div className="flex items-center space-x-2 my-4">
        <Switch
          className="bg-zinc-800"
          id="skills-toggle"
          onCheckedChange={(checked) => setShowPrevious(checked)}
        />
        <label
          htmlFor="skills-toggle"
          className="text-sm text-zinc-400 select-none active:opacity-50"
        >
          Show previous skills
        </label>
      </div>
      {/* <div>
        <pre>{JSON.stringify(oldSkills, null, 2)}</pre>
      </div> */}

      <ListOfSkills skills={showPrevious ? oldSkills : newSkills} />
    </div>
  );
}
