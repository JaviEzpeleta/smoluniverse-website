import MiniTitle from "@/components/MiniTitle";
import BigTitle from "@/components/BigTitle";
import { findUserByHandle } from "@/lib/postgres";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { getBalanceByHandle } from "@/lib/web3functions";
import { ethers } from "ethers";
import { friendlyNumber } from "@/lib/numbers";
import { BsWallet2 } from "react-icons/bs";
import ToolTipped from "@/components/ToolTipped";
import Title from "@/components/Title";
import Link from "next/link";

const UserProfilePage = async ({
  params,
}: {
  params: Promise<{ handle: string }>;
}) => {
  const { handle } = await params;

  const user = await findUserByHandle(handle);

  if (!user) {
    return <div>User not found</div>;
  }

  const balanceInWei = await getBalanceByHandle(handle);
  const balance = ethers.formatEther(balanceInWei);
  const skills = JSON.parse(user.skills);
  const lifeContext = JSON.parse(user.life_context);

  return (
    <div className="p-4">
      {/* <div></div> */}
      <div className="p-4 md:px-6 rounded-xl bg-black shadow-md shadow-zinc-900 border border-zinc-800">
        <div className="flex justify-between w-full items-center">
          <div className="flex gap-4 items-center">
            <div
              className="rounded-full w-24 h-24 bg-zinc-900"
              style={{
                backgroundImage: `url(${user.profile_picture})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div>
              <Title>{user.display_name}</Title>
              <Link
                href={`https://twitter.com/${user.handle}`}
                target="_blank"
                className="text-indigo-400 hover:text-indigo-300 transition-all active:opacity-60"
              >
                <div>@{user.handle}</div>
              </Link>
              <div>
                {lifeContext.location}{" "}
                <span className="pl-1 opacity-70">
                  {lifeContext.relationship_status_code}
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-2 flex flex-col items-end justify-end">
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
            <div className="flex flex-col items-end gap-2 text-base">
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
            </div>
          </div>
        </div>
        <div className="flex gap-2 justify-center flex-col pt-4 px-1">
          <MiniTitle>{lifeContext.current_job_title}</MiniTitle>
          <div>{lifeContext.one_liner}</div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 w-full mt-4">
        <div className="bg-zinc-900 rounded-lg p-4 px-6 md:max-w-sm w-full">
          <MiniTitle>Skills</MiniTitle>
          <pre>{JSON.stringify(skills, null, 2)}</pre>
          {/* <div className="flex flex-col gap-2 pt-2">
            {skills.map(
              (
                {
                  emoji,
                  name,
                  level,
                  description,
                }: {
                  emoji: string;
                  name: string;
                  level: string;
                  description: string;
                },
                index: number
              ) => (
                <ToolTipped text={description} key={index}>
                  <div className="bg-zinc-800 rounded-lg p-2 pb-1 flex items-center gap-2 justify-between">
                    <div className="flex items-center gap-2">
                      <div>{emoji}</div>
                      <div>{name}</div>
                    </div>
                    <div>{level}</div>
                  </div>
                </ToolTipped>
              )
            )}
          </div> */}
        </div>
        <div className="bg-zinc-900 rounded-lg p-4 px-6 flex-1">
          <MiniTitle>Life Goals</MiniTitle>
          <MarkdownRenderer>{user.life_goals}</MarkdownRenderer>
        </div>
      </div>

      {/* <div>
        <pre>{JSON.stringify(skills, null, 2)}</pre>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div> */}
    </div>
  );
};

export default UserProfilePage;
