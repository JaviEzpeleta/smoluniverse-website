"use client";

import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import LifeContextDebugger from "./LifeContextDebugger";
import { MarkdownRenderer } from "./MarkdownRenderer";

export default function LifeGoalsToggle({
  oldGoals,
  newGoals,
}: {
  oldGoals: any;
  newGoals: any;
}) {
  const [showPrevious, setShowPrevious] = useState(false);

  return (
    <div>
      <div className="flex items-center space-x-2 my-4">
        <Switch
          className="bg-zinc-800"
          id="life-goals-toggle"
          onCheckedChange={(checked) => setShowPrevious(checked)}
        />
        <label
          htmlFor="life-goals-toggle"
          className="text-sm text-zinc-400 select-none active:opacity-50"
        >
          Show previous life goals
        </label>
      </div>
      <MarkdownRenderer>{showPrevious ? oldGoals : newGoals}</MarkdownRenderer>

      {/* <LifeContextDebugger
        step={1}
        lifeContext={showPrevious ? oldGoals : newGoals}
      /> */}
    </div>
  );
}
