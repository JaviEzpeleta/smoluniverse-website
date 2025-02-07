"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import MiniTitle from "./MiniTitle";
import BlurryEntrance from "./BlurryEntrance";
import EventCard from "./EventCard";
import { RawUser } from "@/lib/types";

const ProfilePageEventsBlock = ({
  handle,
  user,
}: {
  handle: string;
  user: RawUser;
}) => {
  const [events, setEvents] = useState<any[]>([]);

  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    const fetchEvents = async () => {
      const res = await axios.post(`/api/events/get-by-user`, {
        handle,
      });
      setEvents(res.data.events);
    };
    fetchEvents();
  }, [handle]);

  if (events.length === 0) {
    return (
      <div className="bg-zinc-900 rounded-lg p-4 px-6 md:max-w-md mx-auto w-full">
        <BlurryEntrance>
          <MiniTitle>No events yet</MiniTitle>
        </BlurryEntrance>
      </div>
    );
  }
  return (
    <div className="bg-zinc-900 rounded-lg p-4 px-6 md:max-w-md mx-auto w-full sticky top-6">
      <BlurryEntrance>
        <MiniTitle>Events ({events.length})</MiniTitle>

        <div className="py-6 space-y-4">
          {events.map((event) => (
            <EventCard key={event.id} user={user} event={event} />
          ))}
        </div>
      </BlurryEntrance>
    </div>
  );
};

export default ProfilePageEventsBlock;
