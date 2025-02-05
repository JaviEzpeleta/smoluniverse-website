import {
  findUserByHandle,
  getSmolTweetById,
  getWalletByHandle,
} from "@/lib/postgres";
import { getBalanceByHandleCached } from "@/lib/web3functions";
import { ethers } from "ethers";
import ProfileHeaderBlock from "@/components/ProfileHeaderBlock";
import ProfileHeaderMoneyBlock from "@/components/ProfileHeaderMoneyBlock";
import ProfilePageJobAndOneLinerBlock from "@/components/ProfilePageJobAndOneLinerBlock";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { timeSince } from "@/lib/time";
import BlurryEntrance from "@/components/BlurryEntrance";

const UserProfilePage = async ({
  params,
}: {
  params: Promise<{ tweetId: string }>;
}) => {
  const { tweetId } = await params;

  const tweet = await getSmolTweetById(tweetId);
  if (!tweet) {
    return <div>Tweet not found</div>;
  }

  const user = await findUserByHandle(tweet.handle);

  if (!user) {
    return <div>User not found</div>;
  }

  const handle = tweet.handle;

  const balanceInWei = await getBalanceByHandleCached(handle);
  const balance = ethers.formatEther(balanceInWei);
  const skills = JSON.parse(user.skills);
  const lifeContext = JSON.parse(user.life_context);
  const wallet = await getWalletByHandle(handle);

  return (
    <div className="p-4">
      {/* <div></div> */}
      <div className="p-4 md:px-6 rounded-xl bg-black shadow-md shadow-zinc-900 border border-zinc-800">
        <div className="flex justify-between w-full items-center">
          <ProfileHeaderBlock
            user={user}
            lifeContext={lifeContext}
            linkToProfile={true}
          />
          <ProfileHeaderMoneyBlock
            balance={balance}
            lifeContext={lifeContext}
            walletAddress={wallet.address}
          />
        </div>
        <ProfilePageJobAndOneLinerBlock lifeContext={lifeContext} />
      </div>

      <BlurryEntrance delay={0.2}>
        <div className="flex flex-col md:flex-row gap-4 w-full my-12">
          <div className="max-w-md mx-auto bg-indigo-900/40 p-4 md:px-8 rounded-xl relative">
            <div className="text-smolGreen flex justify-end absolute -top-2 -right-2 text-sm rotate-3">
              <BlurryEntrance delay={0.22}>
                <div>{timeSince(new Date(tweet.created_at).getTime())}</div>
              </BlurryEntrance>
            </div>
            <MarkdownRenderer>{tweet.content}</MarkdownRenderer>
          </div>
        </div>
      </BlurryEntrance>
    </div>
  );
};

export default UserProfilePage;
