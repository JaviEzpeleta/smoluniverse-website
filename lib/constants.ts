// * ERC20 token contract address:
export const ERC20_TOKEN_CONTRACT_ADDRESS =
  "0xEd132A151816C1AEEAe5d58a5A7078aFf5C52312";
export const DEPLOYER_WALLET_ADDRESS =
  "0x6154CCc7ef29D01A30AA8f51afAB635Ae32d581b";
// * profile generation:
export const LIFE_GOALS_DEFAULT_COUNT = 6;

// * twitter api:
export const MAX_PUBLICATIONS_WHEN_PARSING_PROFILE = 92;
export const MAX_TWEET_API_CALL_COUNT = 8;

// * AI models:
export const GEMINI_LATEST = "gemini-2.0-flash-exp";
export const GEMINI_THINKING = "gemini-2.0-flash-thinking-exp";

// discord webhooks:
export const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL as string;
export const DISCORD_WEBHOOK_ERRORS_URL = process.env
  .DISCORD_WEBHOOK_ERRORS_URL as string;

export const IS_LOCALHOST = process.env.NODE_ENV === "development";

export const PAGE_SIZE = 30;

export const BASESCAN_URL = "https://sepolia.basescan.org";
