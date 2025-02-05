import {
  findUserByHandle,
  getSmolTweetById,
  getWalletByHandle,
} from "@/lib/postgres";
import { getBalanceByHandleCached, ownedNFTs } from "@/lib/web3functions";
import { ethers } from "ethers";
import ProfileHeaderBlock from "@/components/ProfileHeaderBlock";
import ProfileHeaderMoneyBlock from "@/components/ProfileHeaderMoneyBlock";
import ProfilePageJobAndOneLinerBlock from "@/components/ProfilePageJobAndOneLinerBlock";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { timeSince } from "@/lib/time";
import BlurryEntrance from "@/components/BlurryEntrance";
import Link from "next/link";

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

  if (!wallet) {
    return <div>Wallet not found</div>;
  }

  const nftsOwned = await ownedNFTs(wallet.address);
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
            nftsOwned={nftsOwned}
            balance={balance}
            lifeContext={lifeContext}
            walletAddress={wallet.address}
          />
        </div>
        <ProfilePageJobAndOneLinerBlock lifeContext={lifeContext} />
      </div>

      <BlurryEntrance delay={0.2}>
        <div className="flex flex-col md:flex-row gap-4 w-full my-12">
          <div className="max-w-md mx-auto bg-zinc-900 p-4 md:px-8 rounded-xl relative">
            <div className="text-smolGreen flex justify-end absolute -top-2 -right-2 text-sm rotate-3">
              <BlurryEntrance delay={0.22}>
                <div>{timeSince(new Date(tweet.created_at).getTime())}</div>
              </BlurryEntrance>
            </div>
            <MarkdownRenderer>{tweet.content}</MarkdownRenderer>
            {tweet.image_url && (
              <div className="py-2 pt-3">
                <Link href={tweet.image_url} target="_blank">
                  <img
                    className="rounded-md border-2 border-zinc-600 hover:border-primary transition-all duration-150 ease-in-out cursor-pointer active:opacity-50"
                    src={tweet.image_url}
                    alt={tweet.content}
                  />
                </Link>
              </div>
            )}
            {tweet.link_preview_img_url && tweet.link && (
              <div className="pb-2 group border-white/30 hover:border-yellow-100 border-2 mt-4 rounded-lg overflow-hidden active:opacity-40 active:scale-[98%] transition-all duration-700 active:duration-75">
                <Link
                  href={tweet.link}
                  target="_blank"
                  className=""
                  draggable="false"
                >
                  <div className="overflow-hidden">
                    <img
                      draggable="false"
                      className="md:brightness-[85%] group-hover:brightness-100 transition-all duration-700 ease-in-out cursor-pointer active:opacity-50 group-hover:scale-[102%]"
                      src={tweet.link_preview_img_url}
                      alt={tweet.content}
                    />
                  </div>
                  <div className="text-sm pt-3 px-2 font-bold font-grandstander group-hover:text-yellow-100 transition-all duration-300 ease-in-out">
                    {tweet.link_title}
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </BlurryEntrance>
    </div>
  );
};

export default UserProfilePage;
