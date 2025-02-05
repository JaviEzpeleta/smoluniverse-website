import { create } from "zustand";
import { RawUser } from "./types";

interface AppState {
  isFetchingOnLoad: boolean;
  setIsFetchingOnLoad: (isFetchingOnLoad: boolean) => void;

  fetchPusherIndex: number;
  setFetchPusherIndex: (fetchPusherIndex: number) => void;

  clones: RawUser[];
  setClones: (agents: RawUser[]) => void;

  showWaitlistModal: boolean;
  setShowWaitlistModal: (showWaitlistModal: boolean) => void;

  logoImageIndex: number;
  setLogoImageIndex: (logoImageIndex: number) => void;
}

const useStore = create<AppState>((set) => ({
  isFetchingOnLoad: false,
  setIsFetchingOnLoad: (isFetchingOnLoad) => set({ isFetchingOnLoad }),

  fetchPusherIndex: 0,
  setFetchPusherIndex: (fetchPusherIndex) => set({ fetchPusherIndex }),

  clones: [],
  setClones: (agents) => set({ clones: agents }),

  showWaitlistModal: false,
  setShowWaitlistModal: (showWaitlistModal) => set({ showWaitlistModal }),

  logoImageIndex: 1,
  setLogoImageIndex: (logoImageIndex) => set({ logoImageIndex }),
}));

// Move the random initialization to a useEffect in a component
export default useStore;
