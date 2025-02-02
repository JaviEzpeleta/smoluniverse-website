import { nl2br } from "@/lib/strings";

const SmolTweetCard = ({ tweet }: { tweet: any }) => {
  return <div>{nl2br(tweet.content)}</div>;
};

export default SmolTweetCard;
