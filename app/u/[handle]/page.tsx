import { findUserByHandle, getWalletByHandle } from "@/lib/postgres";
import { getBalanceByHandleCached, ownedNFTs } from "@/lib/web3functions";
import { ethers } from "ethers";
import ProfileHeaderBlock from "@/components/ProfileHeaderBlock";
import ProfileHeaderMoneyBlock from "@/components/ProfileHeaderMoneyBlock";
import ProfilePageSkillsBlock from "@/components/ProfilePageSkillsBlock";
import ProfilePageJobAndOneLinerBlock from "@/components/ProfilePageJobAndOneLinerBlock";
import ProfilePageLifeGoalsBlock from "@/components/ProfilePageLifeGoalsBlock";
import ProfilePageTweetsBlock from "@/components/ProfilePageTweetsBlock";
import ProfilePageEventsBlock from "@/components/ProfilePageEventsBlock";
import ProfilePlayground from "@/components/ProfilePlayground";
import { IS_LOCALHOST } from "@/lib/constants";

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

  const balanceInWei = await getBalanceByHandleCached(handle);
  const balance = ethers.formatEther(balanceInWei);

  let skills = [] as any[];
  // first, validate the skills json string is valid
  const isValidSkills = validateJsonString(user.skills);
  if (!isValidSkills) {
    const skilsStringFixed = fixJsonString(user.skills);
    const skillsParsed = JSON.parse(skilsStringFixed);
    skills = skillsParsed as any[];
  } else {
    skills = JSON.parse(user.skills);
  }

  // console.log("user.skills");
  // console.log("user.skills");
  // console.log(user.skills);

  const lifeContext = JSON.parse(user.life_context);
  const wallet = await getWalletByHandle(handle);

  if (!wallet) {
    return <div>Wallet not found</div>;
  }

  const nftsOwned = await ownedNFTs(wallet.address);

  return (
    <div className="p-4">
      {/* <div></div> */}
      <div className="sm:p-4 md:px-6 rounded-xl bg-black sm:shadow-md sm:shadow-zinc-900 sm:border sm:border-zinc-800">
        <div className="flex flex-col md:flex-row justify-between w-full items-start md:items-center">
          <ProfileHeaderBlock user={user} lifeContext={lifeContext} />
          <ProfileHeaderMoneyBlock
            nftsOwned={nftsOwned}
            balance={balance}
            lifeContext={lifeContext}
            walletAddress={wallet.address}
          />
        </div>
        <ProfilePageJobAndOneLinerBlock lifeContext={lifeContext} />
      </div>

      {IS_LOCALHOST && (
        <div className="pt-6">
          <ProfilePlayground user={user} />
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 w-full my-4">
        <ProfilePageSkillsBlock skills={skills} handle={handle} />
        <ProfilePageLifeGoalsBlock lifeGoals={user.life_goals} />
      </div>
      <div className="flex flex-col md:flex-row gap-4 w-full my-4 relative">
        <div className="">
          <ProfilePageEventsBlock handle={handle} user={user} />
        </div>
        <ProfilePageTweetsBlock handle={handle} />
      </div>

      {/* <div>
        <pre>{JSON.stringify(skills, null, 2)}</pre>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div> */}
    </div>
  );
};

export default UserProfilePage;

function fixJsonString(jsonStr: string): string {
  // Trim extra whitespace
  const trimmed = jsonStr.trim();

  // Check if the JSON array ends with a ']' but not with '}]'
  if (trimmed.endsWith("]") && !trimmed.endsWith("}]")) {
    // Remove the last character (the closing array bracket)
    // and append a missing '}' plus the closing bracket
    return trimmed.slice(0, -1) + "}]";
  }

  // Otherwise, return the original string
  return jsonStr;
}

function validateJsonString(jsonStr: string): boolean {
  try {
    JSON.parse(jsonStr);
    return true;
  } catch (e) {
    return false;
  }
}
