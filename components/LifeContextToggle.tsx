"use client";

import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import LifeContextDebugger from "./LifeContextDebugger";

export default function LifeContextToggle({
  oldContext,
  newContext,
}: {
  oldContext: any;
  newContext: any;
}) {
  const [showPrevious, setShowPrevious] = useState(false);

  return (
    <div>
      <div className="flex items-center space-x-2 my-4">
        <Switch
          className="bg-zinc-800"
          id="life-context-toggle"
          onCheckedChange={(checked) => setShowPrevious(checked)}
        />
        <label
          htmlFor="life-context-toggle"
          className="text-sm text-zinc-400 select-none active:opacity-50"
        >
          Show previous life context
        </label>
      </div>

      <LifeContextDebugger
        step={1}
        lifeContext={showPrevious ? oldContext : newContext}
      />
    </div>
  );
}
