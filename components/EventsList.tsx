"use client";

import { useEffect, useState } from "react";
import BlurryEntrance from "./BlurryEntrance";
import { Button } from "./ui/button";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import MiniTitle from "./MiniTitle";
import SmolTweetCard from "./SmolTweetCard";

const EventsList = () => {
  const [events, setEvents] = useState([]);
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
    setIsCreatingNewEvent(true);
    const res = await axios.get("/api/events/create");
    console.log("callToCreateANewEvent", res);
    toast({
      title: "New Event Created!",
    });
    setIsCreatingNewEvent(false);
  };

  return (
    <div className="flex flex-col gap-4 py-12">
      <BlurryEntrance delay={0.15}>
        <div className="flex justify-between w-full items-center">
          <div className="text-2xl font-bold">Recent Events</div>
          <Button disabled={isCreatingNewEvent} onClick={callToCreateANewEvent}>
            {isCreatingNewEvent ? "Creating..." : "New Event"}
          </Button>
        </div>
      </BlurryEntrance>
      <div className="p-2 hello">
        <MiniTitle>{smolTweets.length} Recent Tweets</MiniTitle>
        <div className="flex flex-col gap-2">
          {smolTweets.map((tweet: any) => (
            <SmolTweetCard key={tweet.id} tweet={tweet} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsList;
