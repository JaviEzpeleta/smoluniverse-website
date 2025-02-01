"use client";

import Title from "@/components/Title";
import { Button } from "@/components/ui/button";

const NewClonePage = () => {
  return (
    <div className="p-6">
      <div className="border-primary/80 border-2 p-4 rounded-md flex flex-col gap-2 items-center justify-center">
        <Title>Create a new Clone</Title>
        <Button>Create</Button>
      </div>
    </div>
  );
};

export default NewClonePage;
