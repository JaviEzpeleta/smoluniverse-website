"use client";

import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const NewClonePage = () => {
  return (
    <div className="p-6">
      <div className="border-primary/80 border-2 p-4 rounded-md flex flex-col gap-2 items-center justify-center">
        <Title>Create a new Clone</Title>
        <div className="flex items-center gap-2">
          <Input placeholder="twitter handle" className="px-3 !text-lg" />
          <Button>Create</Button>
        </div>
      </div>
    </div>
  );
};

export default NewClonePage;
