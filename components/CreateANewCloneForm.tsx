"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Title from "@/components/Title";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { ImSpinner8 } from "react-icons/im";
import { motion, AnimatePresence } from "framer-motion";
import useStore from "@/lib/zustandStore";
import BlurryEntrance from "./BlurryEntrance";

const CreateANewCloneForm = () => {
  const { fetchPusherIndex, setFetchPusherIndex } = useStore((state) => state);
  const [twitterHandle, setTwitterHandle] = useState("javitoshi");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(
        twitterHandle.length,
        twitterHandle.length
      );
    }
  }, []);

  const { toast } = useToast();
  const submitForm = async () => {
    if (isLoading) {
      return;
    }
    if (twitterHandle.trim() === "") {
      toast({
        title: "Please enter a twitter handle",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    toast({
      title: "Creating a new clone...",
      description: "This may take a while...",
      variant: "success",
    });
    const res = await axios.post("/api/users/create", {
      handle: twitterHandle,
    });
    if (res.data.success) {
      // read all users now again?

      toast({
        title: "Clone created successfully",
        description: "You can now start cloning",
        variant: "success",
      });
    } else {
      toast({
        title: "Error creating clone",
        description: "Please try again",
        variant: "destructive",
      });
    }

    setFetchPusherIndex(fetchPusherIndex + 1);

    setIsLoading(false);
  };

  return (
    <BlurryEntrance delay={0.1}>
      <div className="border-primary/60 border-2 p-4 py-8 rounded-2xl flex flex-col items-center justify-center">
        <BlurryEntrance delay={0.18}>
          <Title>Create a new Clone</Title>
        </BlurryEntrance>
        <BlurryEntrance delay={0.24}>
          <div className="flex items-center gap-2 py-6">
            <Input
              ref={inputRef}
              disabled={isLoading}
              value={twitterHandle}
              onChange={(e) => setTwitterHandle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  submitForm();
                }
              }}
              placeholder="twitter handle to clone"
              className="px-5 !text-lg"
            />
            <Button onClick={submitForm}>
              <motion.div
                className="px-4 flex items-center justify-center"
                animate={{
                  width: isLoading ? 80 : 120,
                }}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2 px-4">
                    <div className="animate-pulse">
                      <ImSpinner8 className="animate-spin" />
                    </div>
                  </div>
                ) : (
                  "Create Clone"
                )}
              </motion.div>
            </Button>
          </div>
        </BlurryEntrance>

        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-2 items-center justify-center animate-pulse py-12">
                <div className="text-4xl">
                  <ImSpinner8 className="animate-spin" />
                </div>
                <Title>Creating a new clone...</Title>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BlurryEntrance>
  );
};

export default CreateANewCloneForm;
