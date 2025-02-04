"use client";

import { useToast } from "@/hooks/use-toast";
import useStore from "@/lib/zustandStore";
import axios from "axios";
import { useEffect } from "react";

const ClonesSessionController = () => {
  const {
    setIsFetchingOnLoad,
    setClones,
    fetchPusherIndex,
    setFetchPusherIndex,
  } = useStore((state) => state);

  const { toast } = useToast();
  useEffect(() => {
    const loadStuff = async () => {
      await Promise.all([
        (async () => {
          const { data } = await axios.post("/api/users/get");
          setClones(data.users);
          return data;
        })(),
      ]);
      setIsFetchingOnLoad(false);
    };

    loadStuff();
  }, [fetchPusherIndex, setIsFetchingOnLoad, setClones]);

  useEffect(() => {
    // cada segundo quiero refresh el pusher index
    const interval = setInterval(() => {
      setFetchPusherIndex(fetchPusherIndex + 1);
    }, 1000 * 60 * 1);
    return () => clearInterval(interval);
  }, [fetchPusherIndex, setFetchPusherIndex]);

  return <></>;
};

export default ClonesSessionController;
