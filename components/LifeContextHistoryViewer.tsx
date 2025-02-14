"use client";

import { useEffect, useState } from "react";
import Title from "./Title";
import { Button } from "./ui/button";
import ListOfSkills from "./ListOfSkills";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { AnimatePresence, motion } from "framer-motion";
import LifeContextDebugger from "./LifeContextDebugger";

const SkillsHistoryViewer = ({ events, user }: { events: any; user: any }) => {
  const [selectedStep, setSelectedStep] = useState(0);

  const [theStepObject, setTheStepObject] = useState(events[selectedStep]);

  const [showBeforeAfter, setShowBeforeAfter] = useState(false);

  useEffect(() => {
    setTheStepObject(events[selectedStep]);
  }, [selectedStep, events]);

  // return <div>PEPE</div>
  return (
    <div className="py-6">
      <Title>Changes viewer (debug)</Title>
      <div className="flex justify-between gap-4 py-8">
        <div className="w-80">
          <div className="bg-zinc-900 rounded-xl p-4 space-y-2">
            {events.map((event: any, index: number) => (
              <div
                key={index}
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
                  // <div>YO!</div>
                  <div className="p-4">
                    <div>
                      <Button
                        onClick={() => setShowBeforeAfter(!showBeforeAfter)}
                      >
                        {showBeforeAfter ? "Show After" : "Show Before"}
                      </Button>
                    </div>
                    {theStepObject && (
                      <LifeContextDebugger
                        step={selectedStep}
                        lifeContext={
                          showBeforeAfter
                            ? // ? "1" : "2"
                              JSON.parse(theStepObject.previous_life_context)
                            : JSON.parse(theStepObject.new_life_context)
                        }
                      />
                    )}
                    {/* <div>
                      <pre>{JSON.stringify(theStepObject, null, 2)}</pre>
                    </div> */}
                    {/* <div>
                      <ListOfSkills
                        skills={
                          showBeforeAfter
                            ? JSON.parse(theStepObject.previous_skills)
                            : JSON.parse(theStepObject.new_skills)
                        }
                      />
                    </div> */}
                  </div>
                )}
              </div>
              {theStepObject && (
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
              )}
            </div>
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SkillsHistoryViewer;
