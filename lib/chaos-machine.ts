import { INDIVIDUAL_ACTIONS } from "./actions-catalog";
import { GEMINI_LATEST, GEMINI_THINKING } from "./constants";
import { postErrorToDiscord } from "./discord";
import { readIRLTweets, getRandomClone } from "./postgres";
import { RawUser } from "./types";
import { SavedTweet } from "./types";

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

export const createNewRandomEvent = async () => {
  // ! RANDOMNESS DISABLED FOR NOW!
  // so i want to pick a random number between 0 and 100
  // if the number is less than 5, the event is a world_event
  // if the number is less than 33, the event is a duet
  // otherwise, the event is an individual

  //   const mainType =
  //     Math.random() < 0.05
  //       ? "world_event"
  //       : Math.random() < 0.33
  //       ? "duet"
  //       : "individual";

  const mainType = "individual";

  if (mainType === "individual") {
    // ! individual
    const randomAction =
      INDIVIDUAL_ACTIONS[Math.floor(Math.random() * INDIVIDUAL_ACTIONS.length)];

    const randomClone = await getRandomClone();
    if (!randomClone) {
      await postErrorToDiscord(
        "🔴 Error in createNewRandomEvent(): no random clone found"
      );
      return "no random clone found";
    }

    const randomCloneTweets = await readIRLTweets({
      handle: randomClone.handle,
    });
    await executeIndividualAction({
      user: randomClone,
      action_type: randomAction,
      tweets: randomCloneTweets,
    });

    return { top_level_type: "individual", action: randomAction };
  }

  return "unsupported main type: " + mainType;
};

const executeIndividualAction = async ({
  user,
  action_type,
  tweets,
}: {
  user: RawUser;
  action_type: string;
  tweets: SavedTweet[];
}) => {
  console.log("🔴 executeIndividualAction", user, action_type, tweets);

  // ! Huge switch case here!!!

  switch (action_type) {
    case "tweet_an_idea":
      await executeTweetAnIdea({ user, tweets });
      break;
    default:
      console.log(
        "🔴 Error in executeIndividualAction: unsupported action type" +
          action_type
      );
    //   await postErrorToDiscord("🔴 Error in executeIndividualAction: unsupported action type" + action_type);
  }
};

const executeTweetAnIdea = async ({
  user,
  tweets,
}: {
  user: RawUser;
  tweets: SavedTweet[];
}) => {
  console.log("🔴 executeTweetAnIdea", user, tweets);

  const keys = [
    process.env.GOOGLE_GEMINI_API_KEY_1!,
    process.env.GOOGLE_GEMINI_API_KEY_2!,
    process.env.GOOGLE_GEMINI_API_KEY_3!,
  ];

  const RANDOM_GEMINI_API_KEY = keys[Math.floor(Math.random() * keys.length)];

  const google = createGoogleGenerativeAI({
    apiKey: RANDOM_GEMINI_API_KEY,
  });

  const { reasoning, text } = await generateText({
    temperature: 0.8,
    model: google(GEMINI_THINKING, {
      //   safetySettings: [
      //     {
      //       category: "HARM_CATEGORY_HARASSMENT",
      //       threshold: "BLOCK_NONE",
      //     },
      //   ],
    }),
    messages: [
      {
        role: "system",
        content: `You are a story teller for an AI clone emulation universe. Based on this character profile and recent tweets, now in this moment of the story, the charactar will write a tweet about a idea that just had.
          
Reply in JSON format: 
{
content: "the tweet content about the idea the user had", // can be in markdown format
}`,
      },
      {
        role: "user",
        content: `Character profile: ${JSON.stringify(user)}

Recent tweets: ${JSON.stringify(tweets)}


<Important>Do not use hashtags or emojis in the tweet. Try to be creative and innovative, and also try to use the same tone and style of the user's previous tweets.</Important>`,
      },
    ],
  });
  console.log("🔴 reasoning", reasoning);
  console.log("🔴 text", text);
  return text;
};
