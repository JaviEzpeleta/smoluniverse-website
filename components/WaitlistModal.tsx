"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useStore from "@/lib/zustandStore";
import BigTitle from "./BigTitle";
import BlurryEntrance from "./BlurryEntrance";
import Title from "./Title";
import Link from "next/link";
import { BsTwitterX } from "react-icons/bs";

const WaitlistModal = () => {
  const { showWaitlistModal, setShowWaitlistModal } = useStore(
    (state) => state
  );

  return (
    <Dialog open={showWaitlistModal} onOpenChange={setShowWaitlistModal}>
      <DialogContent className="bg-zinc-950/80 text-zinc-100 border-primary/70 md:p-12 lg:px-24 lg:max-w-3xl !rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            <BlurryEntrance>
              <BigTitle>Smol Universe</BigTitle>
            </BlurryEntrance>
            <BlurryEntrance delay={0.04}>
              <BigTitle>is coming soon!</BigTitle>
            </BlurryEntrance>
          </DialogTitle>
        </DialogHeader>

        <BlurryEntrance delay={0.08}>
          <div className="space-y-6 mt-6 text-center text-xl py-8 px-4 rounded-xl bg-gradient-to-br from-zinc-900 to-black">
            <Title>To join the waitlist:</Title>
            <BlurryEntrance delay={0.12}>
              <div className="space-y-2">
                <div>1 - Follow us on Twitter</div>
                <div>2 - DM us on Twitter</div>
              </div>
            </BlurryEntrance>
            <BlurryEntrance delay={0.16}>
              <div className="text-zinc-300 max-w-60 mx-auto">
                ...and we will add a clone of you to the game asap!
              </div>
            </BlurryEntrance>
          </div>
        </BlurryEntrance>

        <BlurryEntrance delay={0.24}>
          <div className="max-w-72 mx-auto">
            <Link href="https://twitter.com/_smoluniverse" target="_blank">
              <Button
                variant="outline"
                className="bg-smolGreen/10 hover:bg-smolGreen/20 border-smolGreen"
              >
                <div className="font-bold text-smolGreen px-4 flex items-center gap-2">
                  <div className="-translate-y-[2px]">
                    <BsTwitterX className="w-4 h-4" />
                  </div>
                  <div>Follow @_smoluniverse</div>
                </div>
              </Button>
            </Link>
          </div>
        </BlurryEntrance>
      </DialogContent>
    </Dialog>
  );
};

export default WaitlistModal;
