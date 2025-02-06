"use client";

import { useEffect, useState } from "react";
import Title from "./Title";
import MiniTitle from "./MiniTitle";
import { Button } from "./ui/button";
import ProfilePageSkillsBlock from "./ProfilePageSkillsBlock";
import ListOfSkills from "./ListOfSkills";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { AnimatePresence, motion } from "framer-motion";

const SkillsHistoryViewer = ({ events, user }: { events: any; user: any }) => {
  const [selectedStep, setSelectedStep] = useState(0);

  const [theStepObject, setTheStepObject] = useState(events[selectedStep]);

  const [showBeforeAfter, setShowBeforeAfter] = useState(false);

  useEffect(() => {
    setTheStepObject(events[selectedStep]);
  }, [selectedStep, events]);

  return (
    <div className="py-6">
      <Title>Changes viewer (debug)</Title>
      <div className="flex justify-between gap-4 py-8">
        <div className="w-80">
          <div className="bg-zinc-900 rounded-xl p-4 space-y-2">
            {events.map((event: any, index: number) => (
              <div
                key={event.id}
                className="p-2 bg-zinc-950 hover:bg-zinc-950/80 active:scale-95 active:opacity-30 transition-all rounded-lg cursor-pointer"
                onClick={() => setSelectedStep(index)}
              >
                {new Date(event.created_at).toLocaleString()}
              </div>
            ))}
          </div>
        </div>
        <AnimatePresence>
          <div className="flex-1 bg-zinc-900 rounded-2xl">
            <div className="flex gap-2">
              <div className="w-96">
                {events[selectedStep] && (
                  <div className="p-4">
                    <div>
                      <Button
                        onClick={() => setShowBeforeAfter(!showBeforeAfter)}
                      >
                        {showBeforeAfter ? "Show After" : "Show Before"}
                      </Button>
                    </div>
                    <div>
                      <ListOfSkills
                        skills={
                          showBeforeAfter
                            ? JSON.parse(theStepObject.previous_skills)
                            : JSON.parse(theStepObject.new_skills)
                        }
                      />
                      {/* <pre>{JSON.stringify(theStepObject.new_skills, null, 2)}</pre> */}
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4 flex-1">
                <motion.div
                  layoutId={`summary-${theStepObject.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <MarkdownRenderer>
                    {theStepObject.summary_of_the_changes}
                  </MarkdownRenderer>
                </motion.div>
              </div>
            </div>
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SkillsHistoryViewer;
