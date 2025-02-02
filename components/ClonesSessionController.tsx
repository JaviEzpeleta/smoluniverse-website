"use client";

import useStore from "@/lib/zustandStore";
import axios from "axios";
import { useEffect } from "react";

const ClonesSessionController = () => {
  const { setIsFetchingOnLoad, setClones, fetchPusherIndex } = useStore(
    (state) => state
  );

  useEffect(() => {
    const loadStuff = async () => {
      await Promise.all([
        (async () => {
          const { data } = await axios.post("/api/users/get");
          // console.log(" 💚 💚 💚 💚 💚 💚 💚 DATA: ", data);
          setClones(data.users);
          return data;
        })(),
      ]);
      setIsFetchingOnLoad(false);
    };

    loadStuff();
  }, [fetchPusherIndex, setIsFetchingOnLoad, setClones]);

  return <></>;
};

export default ClonesSessionController;
