import { create } from "zustand";
import { RawUser } from "./types";

interface AppState {
  isFetchingOnLoad: boolean;
  setIsFetchingOnLoad: (isFetchingOnLoad: boolean) => void;

  fetchPusherIndex: number;
  setFetchPusherIndex: (fetchPusherIndex: number) => void;

  clones: RawUser[];
  setClones: (agents: RawUser[]) => void;
}

const useStore = create<AppState>((set) => ({
  isFetchingOnLoad: false,
  setIsFetchingOnLoad: (isFetchingOnLoad) => set({ isFetchingOnLoad }),

  fetchPusherIndex: 0,
  setFetchPusherIndex: (fetchPusherIndex) => set({ fetchPusherIndex }),

  clones: [],
  setClones: (agents) => set({ clones: agents }),
}));

export default useStore;
