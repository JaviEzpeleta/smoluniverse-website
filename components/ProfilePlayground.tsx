"use client";

import { RawUser } from "@/lib/types";
import MiniTitle from "./MiniTitle";
import { ACTIONS_OBJECT } from "@/lib/actions-catalog";
import { Button } from "./ui/button";
import axios from "axios";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const ProfilePlayground = ({ user }: { user: RawUser }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const executeAction = async (code: string) => {
    console.log(code);
    setIsLoading(true);
    toast({
      title: "Executing action...",
    });
    const res = await axios.post("/api/execute-from-playground", {
      code,
      handle: user.handle,
    });
    console.log(res);
    setIsLoading(false);
  };
  return (
    <div className="bg-zinc-900 rounded-lg p-4 px-6 w-full">
      <MiniTitle>ProfilePlayground</MiniTitle>
      <div className="py-3 flex flex-wrap justify-center gap-3">
        {ACTIONS_OBJECT.map((action) => (
          <Button
            disabled={isLoading}
            onClick={() => executeAction(action.code)}
            size="lg"
            variant="outlineGray"
            key={action.code}
            // className="bg-zinc-800 rounded-lg p-2 pb-1 flex items-center gap-2 justify-between"
          >
            <div className="flex items-center gap-2">
              <div>{action.emoji}</div>
              <div>{action.name}</div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ProfilePlayground;
