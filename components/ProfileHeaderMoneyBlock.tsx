"use client";

import MiniTitle from "./MiniTitle";
import ToolTipped from "./ToolTipped";
import BlurryEntrance from "./BlurryEntrance";
import Link from "next/link";
import {
  BASESCAN_URL,
  ERC20_TOKEN_CONTRACT_ADDRESS,
  NFT_CONTRACT_ADDRESS,
  OPENSEA_URL,
} from "@/lib/constants";
import Image from "next/image";

const ProfileHeaderMoneyBlock = ({
  balance,
  lifeContext,
  walletAddress,
  nftsOwned,
}: {
  balance: string;
  lifeContext: any;
  walletAddress: string;
  nftsOwned: number;
}) => {
  return (
    <div className="space-y-2 flex flex-col items-start md:items-end pt-4 sm:pt-0 justify-start">
      <BlurryEntrance delay={0.15}>
        <div className="flex items-center gap-2">
          {nftsOwned > 0 && (
            <Link
              href={`${OPENSEA_URL}/${walletAddress}`}
              target="_blank"
              className="bg-blue-200/10 text-blue-200 hover:bg-blue-200/20
          active:opacity-40 group
        transition-all duration-100 w-12
        p-2 pb-1 rounded-full flex items-center justify-center gap-3 h-12"
            >
              <Image
                src="/images/opensea-logo.svg"
                alt="OpenSea"
                className="bg-white group-hover:scale-[112%] group-hover:rotate-[360deg]
                ease-in-out group-active:scale-95 group-active:rotate-0
                transition-all duration-500 rounded-full p-[1px] -translate-y-[2.6px]"
                width={26}
                height={26}
              />
            </Link>
          )}

          <Link
            href={`${BASESCAN_URL}/token/${ERC20_TOKEN_CONTRACT_ADDRESS}?a=${walletAddress}`}
            target="_blank"
          >
            <div
              className="bg-primary/10 text-primary hover:bg-primary/15
             active:opacity-40 group
           transition-all duration-100
           p-2 pb-1 rounded-full px-4 flex items-center gap-3"
            >
              {/* <div className="bg-zinc-800 hover:bg-zinc-700 hover:text-zinc-50 transition-all duration-150 active:opacity-40 text-zinc-200 font-bold rounded-full p-1.5 pr-3 flex items-center justify-center gap-2"> */}
              <Image
                src="/images/etherscan-logo.png"
                alt="Etherscan"
                className="bg-white group-hover:scale-[112%] group-hover:rotate-[360deg] 
              ease-in-out group-active:scale-95 group-active:rotate-0
               transition-all duration-500 rounded-full p-[1px] -translate-y-[2.6px]"
                width={26}
                height={26}
              />
              {/* <div className="translate-y-0.5">$SMOL Contract</div>
            </div> */}

              {/* <BsWallet2 className="text-xl -translate-y-1" /> */}
              <MiniTitle>
                {/* {friendlyNumber(Number(balance))} */}
                {Number(balance).toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                })}
                <span className="text-primary/80 font-mono text-xl font-medium pl-0.5">
                  $
                </span>
                <span className="text-xl">SMOL</span>
              </MiniTitle>
            </div>
          </Link>
        </div>
      </BlurryEntrance>
      <div className="flex flex-col items-center justify-center md:items-end gap-2 text-base mx-0">
        <BlurryEntrance delay={0.25}>
          <ToolTipped text={lifeContext.weekly_jobs_income_explained}>
            <div className="flex items-center gap-2 bg-smolGreen/15 text-smolGreen p-1 pb-0.5 rounded-full px-2 pl-3">
              {/* <div>{lifeContext.relationship_status_code}</div> */}
              <div>
                +{lifeContext.weekly_jobs_income.toLocaleString()}
                <span className="font-mono text-sm font-medium">$</span>
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
                -{lifeContext.weekly_life_expenses.toLocaleString()}
                <span className="font-mono text-sm font-medium">$</span>
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
