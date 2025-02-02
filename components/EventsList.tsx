"use client";

import { useState } from "react";
import BlurryEntrance from "./BlurryEntrance";
import { Button } from "./ui/button";
import axios from "axios";

const EventsList = () => {
  const [events, setEvents] = useState([]);

  const [isCreatingNewEvent, setIsCreatingNewEvent] = useState(false);

  const callToCreateANewEvent = async () => {
    setIsCreatingNewEvent(true);
    const res = await axios.get("/api/events/create");
    console.log("callToCreateANewEvent", res);
    setIsCreatingNewEvent(false);
  };

  return (
    <div className="flex flex-col gap-4 py-12">
      <BlurryEntrance delay={0.15}>
        <div className="flex justify-between w-full items-center">
          <div className="text-2xl font-bold">Recent Events</div>
          <Button>New Event</Button>
        </div>
      </BlurryEntrance>
    </div>
  );
};

export default EventsList;
