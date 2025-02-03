"use client";

import { BsWallet2 } from "react-icons/bs";
import MiniTitle from "./MiniTitle";
import ToolTipped from "./ToolTipped";
import BlurryEntrance from "./BlurryEntrance";

const ProfileHeaderMoneyBlock = ({
  balance,
  lifeContext,
}: {
  balance: string;
  lifeContext: any;
}) => {
  return (
    <div className="space-y-2 flex flex-col items-end justify-end">
      <BlurryEntrance delay={0.15}>
        <div className="bg-primary/10 text-primary p-2 pb-1 rounded-full px-4 flex items-center gap-3">
          <BsWallet2 className="text-xl -translate-y-1" />
          <MiniTitle>
            <span className="text-primary/80 font-mono text-xl font-medium">
              $
            </span>
            {/* {friendlyNumber(Number(balance))} */}
            {Number(balance).toLocaleString("en-US", {
              maximumFractionDigits: 2,
            })}
            <span className="text-xl pl-1">SMOL</span>
          </MiniTitle>
        </div>
      </BlurryEntrance>
      <div className="flex flex-col items-end gap-2 text-base">
        <BlurryEntrance delay={0.25}>
          <ToolTipped text={lifeContext.weekly_jobs_income_explained}>
            <div className="flex items-center gap-2 bg-smolGreen/15 text-smolGreen p-1 pb-0.5 rounded-full px-2 pl-3">
              {/* <div>{lifeContext.relationship_status_code}</div> */}
              <div>
                + <span className="font-mono text-sm font-medium">$</span>
                {lifeContext.weekly_jobs_income.toLocaleString()}{" "}
                <span className="text-sm">SMOL/week</span>
              </div>
              <div>
                <div></div>
              </div>
            </div>
          </ToolTipped>
        </BlurryEntrance>
        <BlurryEntrance delay={0.35}>
          <ToolTipped text={lifeContext.weekly_life_expenses_explained}>
            <div className="flex items-center gap-2 bg-smolRed/15 text-smolRed p-1 pb-0.5 rounded-full px-2 pl-3">
              {/* <div>{lifeContext.relationship_status_code}</div> */}
              <div>
                - <span className="font-mono text-sm font-medium">$</span>
                {lifeContext.weekly_life_expenses.toLocaleString()}{" "}
                <span className="text-sm">SMOL/week</span>
              </div>
              <div>
                <div></div>
              </div>
            </div>
          </ToolTipped>
        </BlurryEntrance>
      </div>
    </div>
  );
};

export default ProfileHeaderMoneyBlock;
