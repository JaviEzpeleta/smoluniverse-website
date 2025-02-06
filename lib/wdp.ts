import { postErrorToDiscord } from "./discord";

import { CdpWalletProvider } from "@coinbase/agentkit";
import { AgentKit, erc20ActionProvider } from "@coinbase/agentkit";
import { cleanHandle } from "./strings";
import { postToDiscord } from "./discord";

export const createAndSaveNewWallet = async (
  handle: string
): Promise<boolean> => {
  try {
    handle = cleanHandle(handle);

    // Configure CDP Wallet Provider
    const config = {
      apiKeyName: process.env.CDP_API_KEY_NAME!,
      apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY!.replace(
        /\\n/g,
        "\n"
      ),
      networkId: process.env.NETWORK_ID || "base-sepolia",
    };

    // Create MPC wallet
    const walletProvider = await CdpWalletProvider.configureWithWallet(config);
    const walletData = await walletProvider.exportWallet();
    const walletAddress = await walletProvider.getAddress();

    // Initialize AgentKit with ERC20 capabilities
    // const agentkit = await AgentKit.from({
    //   walletProvider,
    //   actionProviders: [erc20ActionProvider()],
    // });

    // Use agentkit to verify wallet setup
    // const walletInfo = await agentkit.execute({
    //   type: "wallet",
    //   command: "getInfo",
    // });

    console.log("Wallet created with AgentKit:", walletData);

    // Save wallet data to database
    // await createWallet({
    //   handle,
    //   address: walletAddress,
    //   privateKey: JSON.stringify(walletData),
    //   permitSignature: "",
    // });

    await postToDiscord(`💰 MPC wallet created for ${handle} using AgentKit`);
    return true;
  } catch (error) {
    await postErrorToDiscord("🔴 Error in createAndSaveNewWallet");
    console.error("🔴 Error in createAndSaveNewWallet:", error);
    return false;
  }
};
