import { ethers } from "ethers";
import { createWallet } from "./postgres";
import { postToDiscord } from "./discord";
import { cleanHandle } from "./strings";

export const createAndSaveNewWallet = async (handle: string) => {
  handle = cleanHandle(handle);

  const newWallet = ethers.Wallet.createRandom();

  const wallet = await createWallet({
    handle,
    address: newWallet.address,
    privateKey: newWallet.privateKey,
  });

  await postToDiscord(`💰 wallet created for ${handle}`);

  return wallet;
};
