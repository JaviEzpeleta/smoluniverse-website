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

export const sendInitialFundsToWallet = async (address: string) => {
  const deployerWalletPrivateKey = process.env.DEPLOYER_WALLET_PRIVATE_KEY;
  const erc20TokenContractAddress = process.env.ERC20_TOKEN_CONTRACT_ADDRESS;

  // Crear provider y signer
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const signer = new ethers.Wallet(deployerWalletPrivateKey!, provider);

  // ABI mínimo para transferir tokens ERC20
  const minABI = [
    "function transfer(address to, uint256 amount) returns (bool)",
  ];

  // Crear instancia del contrato
  const tokenContract = new ethers.Contract(
    erc20TokenContractAddress!,
    minABI,
    signer
  );

  // Transferir 10,000 tokens (ajusta los decimales según tu token)
  const amount = ethers.parseUnits("10000", 18);
  const tx = await tokenContract.transfer(address, amount);
  await tx.wait();

  await postToDiscord(`💸 Sent 10K tokens to ${address}`);

  return tx;
};
