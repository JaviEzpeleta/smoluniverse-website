import MiniTitle from "@/components/MiniTitle";
import BigTitle from "@/components/BigTitle";
import { findUserByHandle } from "@/lib/postgres";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { getBalanceByHandle } from "@/lib/web3functions";
import { ethers } from "ethers";
import { friendlyNumber } from "@/lib/numbers";
import { BsWallet2 } from "react-icons/bs";
import ToolTipped from "@/components/ToolTipped";

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

  return (
    <div className="p-4 space-y-4">
      {/* <div></div> */}
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
            <BigTitle>{user.display_name}</BigTitle>
            <MiniTitle>@{user.handle}</MiniTitle>
          </div>
        </div>
        <div className="bg-smolGreen/10 text-smolGreen p-2 pb-1 rounded-full px-4 flex items-center gap-3">
          <BsWallet2 className="text-xl -translate-y-1" />
          <MiniTitle>
            {/* {friendlyNumber(Number(balance))} */}
            {Number(balance).toLocaleString("en-US", {
              maximumFractionDigits: 2,
            })}
            <span className="text-xl pl-1">
              <span className="text-smolGreen/60 font-mono text-base font-medium">
                $
              </span>
              SMOL
            </span>
          </MiniTitle>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <div className="bg-zinc-900 rounded-lg p-4 px-6 md:max-w-sm w-full">
          <MiniTitle>Skills</MiniTitle>
          <div className="flex flex-col gap-2 pt-2">
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
                      {/* <div className="text-sm text-zinc-400">{description}</div> */}
                    </div>
                    <div>{level}</div>
                  </div>
                </ToolTipped>
              )
            )}
          </div>
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
