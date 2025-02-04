import { Contract, ethers, Wallet } from "ethers";
import { createWallet, getWalletByHandle } from "./postgres";
import { postErrorToDiscord, postToDiscord } from "./discord";
import { cleanHandle } from "./strings";
import { ERC20_TOKEN_CONTRACT_ADDRESS } from "./constants";
import { unstable_cache } from "next/cache";

import smolABI from "./abi/smolABI.json";

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
      spender: "0x0000000000000000000000000000000000000000",
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

export const getBalanceByHandleCached = unstable_cache(
  getBalanceByHandleNoCache,
  ["balance-by-handle"],
  {
    revalidate: 3600,
    tags: ["balance"],
  }
);

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
  const permitABI = [
    "function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s)",
    "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  ];

  // Create new contract instance with permit function
  const tokenWithPermit = new ethers.Contract(
    await token.getAddress(),
    permitABI,
    deployer
  );

  const { v, r, s } = ethers.Signature.from(signature);

  const permitTx = await tokenWithPermit.permit(
    cloneA,
    deployer.address,
    amount,
    deadline,
    v,
    r,
    s
  );
  await permitTx.wait();
  console.log("Permit ejecutado correctamente.");

  const transferTx = await tokenWithPermit.transferFrom(cloneA, cloneB, amount);
  await transferTx.wait();
  console.log("Transferencia completada de cloneA a cloneB.");
}
