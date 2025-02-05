import { findUserByHandle, getWalletByHandle } from "@/lib/postgres";
import { getBalanceByHandleCached, ownedNFTs } from "@/lib/web3functions";
import { ethers } from "ethers";
import ProfileHeaderBlock from "@/components/ProfileHeaderBlock";
import ProfileHeaderMoneyBlock from "@/components/ProfileHeaderMoneyBlock";
import ProfilePageSkillsBlock from "@/components/ProfilePageSkillsBlock";
import ProfilePageJobAndOneLinerBlock from "@/components/ProfilePageJobAndOneLinerBlock";
import ProfilePageLifeGoalsBlock from "@/components/ProfilePageLifeGoalsBlock";
import ProfilePageTweetsBlock from "@/components/ProfilePageTweetsBlock";
import ProfilePlayground from "@/components/ProfilePlayground";

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
  const skills = JSON.parse(user.skills);
  const lifeContext = JSON.parse(user.life_context);
  const wallet = await getWalletByHandle(handle);

  if (!wallet) {
    return <div>Wallet not found</div>;
  }

  const nftsOwned = await ownedNFTs(wallet.address);

  return (
    <div className="p-4">
      {/* <div></div> */}
      <div className="p-4 md:px-6 rounded-xl bg-black shadow-md shadow-zinc-900 border border-zinc-800">
        <div className="flex justify-between w-full items-center">
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

      <div className="pt-6">
        <ProfilePlayground user={user} />
      </div>

      <div className="flex flex-col md:flex-row gap-4 w-full my-4">
        <ProfilePageSkillsBlock skills={skills} />
        <ProfilePageLifeGoalsBlock lifeGoals={user.life_goals} />
      </div>
      <ProfilePageTweetsBlock handle={handle} />

      {/* <div>
        <pre>{JSON.stringify(skills, null, 2)}</pre>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div> */}
    </div>
  );
};

export default UserProfilePage;
