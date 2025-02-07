"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import MiniTitle from "./MiniTitle";
import BlurryEntrance from "./BlurryEntrance";
import TweetCard from "./TweetCard";

const ProfilePageTweetsBlock = ({ handle }: { handle: string }) => {
  const [tweets, setTweets] = useState<any[]>([]);

  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    const fetchTweets = async () => {
      const res = await axios.post(`/api/smol-tweets/get-by-user`, {
        handle,
      });
      setTweets(res.data.smolTweets);
    };
    fetchTweets();
  }, [handle]);

  if (tweets.length === 0) {
    return (
      <div className="bg-zinc-900 rounded-lg p-4 px-6 flex-1 mx-auto w-full">
        <BlurryEntrance>
          <MiniTitle>No tweets yet</MiniTitle>
        </BlurryEntrance>
      </div>
    );
  }
  return (
    <div className="bg-zinc-900 rounded-lg p-4 px-6 flex-1 mx-auto w-full">
      <BlurryEntrance>
        <MiniTitle>Tweets</MiniTitle>

        <div className="py-6 space-y-4">
          {tweets.map((tweet) => (
            <TweetCard key={tweet.id} theTweet={tweet} />
          ))}
        </div>
      </BlurryEntrance>
    </div>
  );
};

export default ProfilePageTweetsBlock;
