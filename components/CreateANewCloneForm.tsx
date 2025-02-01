"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Title from "@/components/Title";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

const CreateANewCloneForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const submitForm = async () => {
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
    <div className="border-primary/80 border-2 p-4 rounded-md flex flex-col gap-2 items-center justify-center">
      <Title>Create a new Clone</Title>
      <div className="flex items-center gap-2">
        <Input placeholder="twitter handle" className="px-3 !text-lg" />
        <Button onClick={submitForm}>
          <div className="px-4">Create</div>
        </Button>
      </div>
    </div>
  );
};

export default CreateANewCloneForm;
