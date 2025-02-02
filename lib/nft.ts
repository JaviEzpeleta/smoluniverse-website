import { ethers } from "ethers";
import { abi } from "../contracts/SmolNFT-abi.json";
import { SMOL_NFT_CONTRACT_ADDRESS } from "./constants";

export const createNFT = async () => {
  const IMAGE_URL =
    "https://m.media-amazon.com/images/I/41CpjYhxALL._UXNaN_FMjpg_QL85_.jpg";
  const CLONE_WALLET_ADDRESS = "0x277daCcb3Eb57e05eEDDd3840119D71385b89210";
  const TEXT = "This is the caption of the NFT";
  const HANDLE = "@test";

  // Use owner wallet to mint NFT
  const deployerWalletPrivateKey = process.env.DEPLOYER_WALLET_PRIVATE_KEY;

  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const ownerWallet = new ethers.Wallet(deployerWalletPrivateKey!, provider);

  // Marketplace address
  const smolNFTContract = new ethers.Contract(
    SMOL_NFT_CONTRACT_ADDRESS,
    abi,
    ownerWallet
  );

  // Mint NFT.
  try {
    const tx = await smolNFTContract.mintAndApprove(
      CLONE_WALLET_ADDRESS,
      ownerWallet.address,
      TEXT,
      HANDLE,
      IMAGE_URL
    );
    await tx.wait();
    console.log("NFT minteado con éxito:", tx);
  } catch (error) {
    console.error("Error al mintear el NFT:", error);
  }
};
