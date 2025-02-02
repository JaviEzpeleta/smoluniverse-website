// * ERC20 token contract address:
export const ERC20_TOKEN_CONTRACT_ADDRESS =
  "0x877b0ffAce077ce8d953626cE1c0AF390D429e56";
export const MARKETPLACE_CONTRACT_ADDRESS =
  "0xfA0207EaCe1FFA99157bc26D31F8BD1dE6D2eeA9";
export const SMOL_NFT_CONTRACT_ADDRESS =
  "0x1ce0ce22eF1e58962CBBCF57F5fa025c45765814";

// * profile generation:
export const LIFE_GOALS_DEFAULT_COUNT = 10;

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
