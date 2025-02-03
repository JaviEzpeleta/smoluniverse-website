"use client";

import { useEffect, useState } from "react";
import BlurryEntrance from "./BlurryEntrance";
import { Button } from "./ui/button";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import TweetCard from "./TweetCard";
import { IS_LOCALHOST } from "@/lib/constants";
import useStore from "@/lib/zustandStore";

const EventsList = () => {
  const { setShowWaitlistModal } = useStore((state) => state);

  const [smolTweets, setSmolTweets] = useState([]);

  const [tweetsFetcherIndex, setTweetsFetcherIndex] = useState(0);

  useEffect(() => {
    const fetchTweets = async () => {
      const res = await axios.post("/api/smol-tweets/get-recent");
      setSmolTweets(res.data.smolTweets);
    };
    fetchTweets();
  }, [tweetsFetcherIndex]);

  const [isCreatingNewEvent, setIsCreatingNewEvent] = useState(false);
  const { toast } = useToast();

  const callToCreateANewEvent = async () => {
    if (!IS_LOCALHOST) {
      setShowWaitlistModal(true);
      return;
    }

    setIsCreatingNewEvent(true);
    const res = await axios.get("/api/events/create");
    console.log("callToCreateANewEvent", res);
    toast({
      title: "New Event Created!",
    });
    setIsCreatingNewEvent(false);
    setTweetsFetcherIndex(tweetsFetcherIndex + 1);
  };

  return (
    <div className="flex flex-col gap-4 py-12">
      <BlurryEntrance delay={0.15}>
        <div className="flex justify-between w-full items-center">
          <div className="text-2xl font-bold">Recent Tweets</div>
          <Button disabled={isCreatingNewEvent} onClick={callToCreateANewEvent}>
            {isCreatingNewEvent ? "Calling..." : "New Event"}
          </Button>
        </div>
      </BlurryEntrance>
      <div className="space-y-4">
        <div className="flex flex-col gap-4">
          {smolTweets.map((tweet: any) => (
            <TweetCard key={tweet.id} theTweet={tweet}>
              {tweet.content}
            </TweetCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsList;
