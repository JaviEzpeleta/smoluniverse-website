import MiniTitle from "@/components/MiniTitle";
import TweetCard from "@/components/TweetCard";
import { ACTIONS_OBJECT } from "@/lib/actions-catalog";
import { getTweetsByActionTypeWithUserData } from "@/lib/postgres";
import { SmolTweetWithUserData } from "@/lib/types";
import NumberFlow from "@number-flow/react";
const ExploreByActionTypePage = async ({
  params,
}: {
  params: Promise<{ actionType: string }>;
}) => {
  const { actionType } = await params;
  const theAction = ACTIONS_OBJECT.find((action) => action.code === actionType);

  if (!theAction) {
    return <div>Action not found</div>;
  }

  const tweets = await getTweetsByActionTypeWithUserData(actionType);

  return (
    <div>
      <div className="pb-6 w-full flex justify-center">
        <MiniTitle>
          {theAction.name} (
          <NumberFlow value={tweets.length} /> tweets)
        </MiniTitle>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {tweets.map((tweet: SmolTweetWithUserData) => (
          <TweetCard key={tweet.id} theTweet={tweet} />
        ))}
      </div>
    </div>
  );
};

export default ExploreByActionTypePage;
