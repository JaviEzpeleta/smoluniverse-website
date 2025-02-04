import { Contract, ethers, Wallet } from "ethers";
import { createWallet, getWalletByHandle } from "./postgres";
import { postErrorToDiscord, postToDiscord } from "./discord";
import { cleanHandle } from "./strings";
import { ERC20_TOKEN_CONTRACT_ADDRESS } from "./constants";

export const createAndSaveNewWallet = async (
  handle: string
): Promise<boolean> => {
  try {
    handle = cleanHandle(handle);

    const newWallet = ethers.Wallet.createRandom();

    await createWallet({
      handle,
      address: newWallet.address,
      privateKey: newWallet.privateKey,
    });

    await postToDiscord(`💰 wallet created for ${handle}`);

    return true;
  } catch (error) {
    await postErrorToDiscord("🔴 Error in createAndSaveNewWallet");
    console.error("🔴 Error in createAndSaveNewWallet:", error);
    return false;
  }
};

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

export const getBalanceByHandle = async (handle: string) => {
  const wallet = await getWalletByHandle(handle);
  if (!wallet) {
    return 0;
  }
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

  // Minimal ABI for balanceOf
  const minABI = ["function balanceOf(address owner) view returns (uint256)"];

  const tokenContract = new ethers.Contract(
    ERC20_TOKEN_CONTRACT_ADDRESS!,
    minABI,
    provider
  );

  const balance = await tokenContract.balanceOf(wallet.address);
  return balance;
};
