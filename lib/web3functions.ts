import { Contract, ethers, Wallet } from "ethers";
import { createWallet, getWalletByHandle } from "./postgres";
import { postErrorToDiscord, postToDiscord } from "./discord";
import { cleanHandle } from "./strings";
import {
  DEPLOYER_WALLET_ADDRESS,
  ERC20_TOKEN_CONTRACT_ADDRESS,
  NFT_CONTRACT_ADDRESS,
} from "./constants";
import { revalidateTag, unstable_cache } from "next/cache";

import smolABI from "./abi/smolABI.json";
import nftABI from "./abi/nftABI.json";

import { Wallet as OurWallet } from "./types";

export const createAndSaveNewWallet = async (
  handle: string
): Promise<boolean> => {
  try {
    handle = cleanHandle(handle);

    const newWallet = ethers.Wallet.createRandom();

    // ! let's get the signature now!
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const plainWallet = new Wallet(newWallet.privateKey, provider);
    const tokenContract = new ethers.Contract(
      ERC20_TOKEN_CONTRACT_ADDRESS!,
      smolABI,
      plainWallet
    );

    const permitSignature = await signPermit({
      wallet: plainWallet,
      token: tokenContract,
      spender: DEPLOYER_WALLET_ADDRESS,
    });

    await createWallet({
      handle,
      address: newWallet.address,
      privateKey: newWallet.privateKey,
      permitSignature,
    });

    await postToDiscord(`💰 wallet created for ${handle}`);

    return true;
  } catch (error) {
    await postErrorToDiscord("🔴 Error in createAndSaveNewWallet");
    console.error("🔴 Error in createAndSaveNewWallet:", error);
    return false;
  }
};

export const sendInitialFundsToWallet = async (address: string) => {
  const deployerWalletPrivateKey = process.env.DEPLOYER_WALLET_PRIVATE_KEY;
  const erc20TokenContractAddress = ERC20_TOKEN_CONTRACT_ADDRESS;

  // Crear provider y signer
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const signer = new ethers.Wallet(deployerWalletPrivateKey!, provider);

  // ABI mínimo para transferir tokens ERC20
  // const minABI = [
  //   "function transfer(address to, uint256 amount) returns (bool)",
  // ];

  // Crear instancia del contrato
  const tokenContract = new ethers.Contract(
    erc20TokenContractAddress!,
    smolABI,
    signer
  );

  // Transferir 10,000 tokens (ajusta los decimales según tu token)
  const amount = ethers.parseUnits("10000", 18);
  const tx = await tokenContract.transfer(address, amount);
  await tx.wait();

  await postToDiscord(`💸 Sent 10K tokens to ${address}`);

  return tx;
};

export const getBalanceByHandleNoCache = async (handle: string) => {
  const wallet = await getWalletByHandle(handle);
  if (!wallet) {
    return "0";
  }
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

  const minABI = ["function balanceOf(address owner) view returns (uint256)"];

  const tokenContract = new ethers.Contract(
    ERC20_TOKEN_CONTRACT_ADDRESS!,
    minABI,
    provider
  );

  const balance = await tokenContract.balanceOf(wallet.address);
  return balance.toString();
};

export const getBalanceByHandleCached = (handle: string) =>
  unstable_cache(
    () => getBalanceByHandleNoCache(handle),
    [`balance-by-handle-${handle}`],
    {
      revalidate: 60 * 60 * 24,
      tags: [`balance-${handle}`],
    }
  )();

// Valor infinito y deadline infinito
const INFINITE_VALUE = ethers.MaxUint256;
const INFINITE_DEADLINE = ethers.MaxUint256;

export const signPermit = async ({
  wallet,
  token,
  spender,
}: {
  wallet: Wallet;
  token: Contract;
  spender: string;
}): Promise<string> => {
  if (!wallet.provider) {
    throw new Error("Wallet provider not found");
  }

  const nonce = await token.nonces(wallet.address);

  // Obtener el DOMAIN_SEPARATOR del contrato token
  const domain = {
    name: await token.name(),
    version: "1",
    chainId: await wallet.provider.getNetwork().then((n) => n.chainId),
    verifyingContract: await token.getAddress(),
  };

  const message = {
    owner: wallet.address,
    spender: spender,
    value: INFINITE_VALUE,
    nonce: nonce,
    deadline: INFINITE_DEADLINE,
  };

  const types = {
    Permit: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" },
    ],
  };

  // Sign message using EIP-712
  const signature = await wallet.signTypedData(domain, types, message);

  return signature;
};

export async function transferFromCloneToClone(
  token: Contract,
  deployer: Wallet,
  cloneA: string,
  cloneB: string,
  amount: bigint,
  signature: string,
  deadline: bigint = ethers.MaxUint256
): Promise<void> {
  console.log("🚀 Starting transfer between clones...");
  console.log("📍 From:", cloneA);
  console.log("🎯 To:", cloneB);
  console.log("💰 Amount:", ethers.formatEther(amount), "tokens");

  const tokenAddress = await token.getAddress();
  console.log("🪙 Token address:", tokenAddress);

  // const permitABI = [
  //   "function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s)",
  //   "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  // ];

  const tokenWithPermit = new ethers.Contract(tokenAddress, smolABI, deployer);

  console.log("✍️ Signature received:", signature);
  const { v, r, s } = ethers.Signature.from(signature);
  console.log("📝 Decoded signature - v:", v, "r:", r, "s:", s);

  const permitParams = {
    owner: cloneA,
    spender: deployer.address,
    amount: amount.toString(),
    deadline: deadline.toString(),
    v,
    r,
    s,
  };
  console.log("🔑 Permit parameters:", permitParams);

  try {
    // console.log("🔐 Executing permit...");
    // const permitTx = await tokenWithPermit.permit(
    //   cloneA,
    //   deployer.address,
    //   INFINITE_VALUE,
    //   deadline,
    //   v,
    //   r,
    //   s
    // );
    // console.log("⏳ Waiting for permit transaction...");
    // const permitReceipt = await permitTx.wait();
    // console.log("✅ Permit executed! Hash:", permitReceipt.hash);

    console.log("💸 Initiating transfer...");
    const transferTx = await tokenWithPermit.transferFrom(
      cloneA,
      cloneB,
      amount
    );
    console.log("⏳ Waiting for transfer transaction...");
    const transferReceipt = await transferTx.wait();
    console.log("🎉 Transfer completed! Hash:", transferReceipt.hash);
  } catch (error) {
    console.error("❌ Transaction failed!");
    console.error("🔍 Error details:", JSON.stringify(error));
    throw error;
  }
}

export const sendMoneyFromWalletAToWalletB = async ({
  walletA,
  walletB,
  amount,
}: {
  walletA: OurWallet;
  walletB: OurWallet;
  amount: bigint;
}) => {
  const deployerWalletPrivateKey = process.env.DEPLOYER_WALLET_PRIVATE_KEY!;

  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const signer = new ethers.Wallet(deployerWalletPrivateKey, provider);

  const tokenContract = new ethers.Contract(
    ERC20_TOKEN_CONTRACT_ADDRESS,
    smolABI,
    signer
  );

  // const signature = await signPermit({
  //   wallet: signer,
  //   token: tokenContract,
  //   spender: wallet2.address,
  // });

  await transferFromCloneToClone(
    tokenContract,
    signer,
    walletA.address,
    walletB.address,
    amount,
    walletA.permit_signature
  );
  revalidateTag(`balance-${walletA.handle}`);
  revalidateTag(`balance-${walletB.handle}`);

  await postToDiscord(
    `💸 Sent ${amount} tokens from ${walletA.address} to ${walletB.address}`
  );
};

export const sendMoneyFromJaviToYu = async () => {
  const wallet = await getWalletByHandle("javitoshi");
  const wallet2 = await getWalletByHandle("mad4yu");

  console.log({ wallet });
  console.log({ wallet2 });

  const amount = ethers.parseUnits("100", 18);

  await sendMoneyFromWalletAToWalletB({
    walletA: wallet,
    walletB: wallet2,
    amount,
  });
};

export const mintNftForClone = async ({
  userHandle,
  artworkUrl,
  nftArtTitle,
}: {
  userHandle: string;
  artworkUrl: string;
  nftArtTitle: string;
}) => {
  const cloneWallet = await getWalletByHandle(userHandle);
  if (!cloneWallet) {
    throw new Error("Wallet not found");
  }

  // Crea un provider y un signer
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const deployerWallet = new ethers.Wallet(
    process.env.DEPLOYER_WALLET_PRIVATE_KEY!,
    provider
  );

  // Si en algún momento necesitas el bytecode: const bytecode = artifact.bytecode;

  // Crea la instancia del contrato (conectada al owner, que es el deployer)
  const contract = new ethers.Contract(
    NFT_CONTRACT_ADDRESS,
    nftABI,
    deployerWallet
  );

  console.log("A la hostia, se va a mintear un NFT con estos datos:");
  console.log("nftImageURL:", artworkUrl);
  console.log("nftTitle:", nftArtTitle);
  console.log("cloneAddress:", cloneWallet.address);

  // Llama a la función mintSmolNFTsCollection (nota: esta función solo la puede llamar el owner)
  try {
    const tx = await contract.mintSmolNFTsCollection(
      cloneWallet.address,
      artworkUrl,
      nftArtTitle
    );
    console.log(
      "Tx enviada, esperando confirmación... (tx hash:",
      tx.hash,
      ")"
    );

    await postToDiscord(`💸 NFT minteado! Confirmado en el bloque: ${tx.hash}`);

    const receipt = await tx.wait();
    console.log(
      "¡Coño, NFT minteado! Confirmado en el bloque:",
      receipt.blockNumber
    );

    return tx.hash;
  } catch (error) {
    console.error("Error al mintear el NFT:", error);
    process.exit(1);
  }
};

export const ownedNFTs = async (address: string): Promise<number> => {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, nftABI, provider);

  try {
    const balance = await contract.balanceOf(address);
    return Number(balance);
  } catch (error) {
    console.error("Error getting NFT balance:", error);
    return 0;
  }
};

export const sendMoneyToCloneFromGovernment = async ({
  wallet,
  amount,
  handle,
}: {
  wallet: OurWallet;
  amount: bigint;
  handle: string;
}) => {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const signer = new ethers.Wallet(
    process.env.DEPLOYER_WALLET_PRIVATE_KEY!,
    provider
  );

  const tokenContract = new ethers.Contract(
    ERC20_TOKEN_CONTRACT_ADDRESS,
    smolABI,
    signer
  );

  const tx = await tokenContract.transfer(wallet.address, amount);
  await tx.wait();

  revalidateTag(`balance-${handle}`);

  await postToDiscord(
    `💸 Sent ${amount} tokens to ${wallet.address} from the government to ${handle}`
  );
};
