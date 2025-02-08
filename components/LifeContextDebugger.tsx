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
  //   const lifeContextObject = JSON.parse(lifeContext.new_life_context);
  return (
    <AnimatePresence>
      <div className="flex gap-2 text-3xl font-bold pt-4">
        <div className="relative">
          <motion.div
            // layout
            key={`${lifeContext.country_emoji}-${step}`}
            layoutId={`${lifeContext.country_emoji}-${step}`}
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
            key={`${lifeContext.city_name}-${step}`}
            layoutId={`${lifeContext.city_name}-${step}`}
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
          key={`${lifeContext.one_liner}-${step}`}
          layoutId={`${lifeContext.one_liner}-${step}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {lifeContext.one_liner}
        </motion.div>
      </div>

      <div className="space-y-2">
        <motion.div
          layoutId={`${lifeContext.weekly_jobs_income}-${step}`}
          className="flex"
        >
          <BlurryEntrance delay={0.25}>
            <ToolTipped text={lifeContext.weekly_jobs_income_explained}>
              <div className="flex items-center gap-2 bg-smolGreen/15 text-smolGreen p-1 pb-0.5 rounded-full px-2 pl-3">
                {/* <div>{lifeContext.relationship_status_code}</div> */}
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

        <motion.div
          layoutId={`${lifeContext.weekly_life_expenses}-${step}`}
          className="flex"
        >
          <BlurryEntrance delay={0.35}>
            <ToolTipped text={lifeContext.weekly_life_expenses_explained}>
              <div className="flex items-center gap-2 bg-smolRed/15 text-smolRed p-1 pb-0.5 rounded-full px-2 pl-3">
                {/* <div>{lifeContext.relationship_status_code}</div> */}
                <div>
                  -
                  <NumberFlow
                    value={lifeContext.weekly_life_expenses}
                    className="text-smolRed"
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
      </div>

      {/* <div>
        <pre>{JSON.stringify(lifeContext, null, 2)}</pre>
      </div> */}
    </AnimatePresence>
  );
};

export default LifeContextDebugger;
