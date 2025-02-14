"use client";

import { AnimatePresence, motion } from "framer-motion";
import BlurryEntrance from "./BlurryEntrance";
import ToolTipped from "./ToolTipped";
import NumberFlow from "@number-flow/react";

const LifeContextDebugger = ({
  lifeContext,
  step,
}: {
  lifeContext: any;
  step: number;
}) => {
  const randomId = Math.random().toString(36).substring(2, 15);
  //   const lifeContextObject = JSON.parse(lifeContext.new_life_context);
  return (
    <AnimatePresence>
      <div className="flex gap-2 text-3xl font-bold pt-4">
        <div className="relative">
          <motion.div
            // layout
            key={`emoji-${step}`}
            layoutId={`emoji-${step}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {lifeContext.country_emoji}
          </motion.div>
        </div>
        <div className="relative">
          <motion.div
            // layout
            key={`city-${step}`}
            layoutId={`city-${step}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {lifeContext.city_name}
          </motion.div>
        </div>
      </div>

      <div className="relative">
        <motion.div
          // layout
          key={`one-liner-${randomId}`}
          layoutId={`one-liner-${randomId}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {lifeContext.one_liner}
        </motion.div>
      </div>

      <div>{lifeContext.one_liner}</div>
      <div className="space-y-2">
        <motion.div layoutId={`weekly-jobs-income-${step}`} className="flex">
          <BlurryEntrance delay={0.25}>
            <ToolTipped text={lifeContext.weekly_jobs_income_explained}>
              <div className="flex items-center gap-2 bg-smolGreen/15 text-smolGreen p-1 pb-0.5 rounded-full px-2 pl-3">
                <div>{lifeContext.relationship_status_code}</div>
                <div>
                  +
                  <NumberFlow
                    value={lifeContext.weekly_jobs_income}
                    className="text-smolGreen"
                  />
                  <span className="font-mono text-sm font-medium">$</span>
                  <span className="text-sm">SMOL/week</span>
                </div>
                <div>
                  <div></div>
                </div>
              </div>
            </ToolTipped>
          </BlurryEntrance>
        </motion.div>

        <motion.div layoutId={`weekly-life-expenses-${step}`} className="flex">
          <BlurryEntrance delay={0.35}>
            <ToolTipped text={lifeContext.weekly_life_expenses_explained}>
              <div className="flex items-center gap-2 bg-smolRed/15 text-smolRed p-1 pb-0.5 rounded-full px-2 pl-3">
                <div>
                  -
                  <NumberFlow
                    value={lifeContext.weekly_life_expenses}
                    className="text-smolRed"
                  />
                  <span className="font-mono text-sm font-medium">$</span>
                  <span className="text-sm">SMOL/week</span>
                </div>
              </div>
            </ToolTipped>
          </BlurryEntrance>
        </motion.div>
      </div>

      {/* <div>
        <pre>{JSON.stringify(lifeContext, null, 2)}</pre>
      </div> */}
    </AnimatePresence>
  );
};

export default LifeContextDebugger;
