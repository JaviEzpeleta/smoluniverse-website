"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Title from "@/components/Title";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { ImSpinner8 } from "react-icons/im";
import { motion, AnimatePresence } from "framer-motion";

const CreateANewCloneForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const submitForm = async () => {
    setIsLoading(!isLoading);
    toast({
      title: "Creating a new clone...",
      description: "This may take a while...",
      variant: "success",
    });
    // await axios.post("/api/users/create", {
    //   name: "test",
    // });
  };
  return (
    <motion.div
      // transition={{
      //   layout: { type: "spring", bounce: 0.2 },
      // }}
      className="border-primary/80 border-2 p-4 py-8 rounded-md flex flex-col items-center justify-center"
    >
      <Title>Create a new Clone</Title>
      <div className="flex items-center gap-2 py-6">
        <Input
          // if user presses enter, submit the form
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              submitForm();
            }
          }}
          placeholder="twitter handle to clone"
          className="px-3 !text-lg"
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
    </motion.div>
  );
};

export default CreateANewCloneForm;
