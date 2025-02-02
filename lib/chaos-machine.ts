import { INDIVIDUAL_ACTIONS } from "./actions-catalog";
import { GEMINI_LATEST, GEMINI_THINKING } from "./constants";
import { postErrorToDiscord } from "./discord";
import { readIRLTweets, getRandomClone, saveNewActionEvent } from "./postgres";
import { ActionEvent, RawUser } from "./types";
import { SavedTweet } from "./types";

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { CoreMessage, generateText } from "ai";

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
  console.log("🚀 executeIndividualAction() begins!!");

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
  const theMessages = [
    {
      role: "system",
      content: `You are a story teller for an AI clone emulation universe. Based on this character profile and recent tweets, now in this moment of the story, the charactar will write a tweet about a idea that just had.
        
Reply in JSON format: 
{
  "content": "the tweet content about the idea the user had", // can be in markdown format
  "reasoning": "the reasoning behind the game character's feelings and thoughts that caused that idea"
}`,
    },
    {
      role: "user",
      content: `Full character profile:
${JSON.stringify(user)}

Recent tweets:
${JSON.stringify(tweets)}

<Important>Do not use hashtags or emojis in the tweet. Try to be creative and innovative, and also try to use the same tone and style of the user's previous tweets.</Important>`,
    },
  ] as CoreMessage[];

  const keys = [
    process.env.GOOGLE_GEMINI_API_KEY_1!,
    process.env.GOOGLE_GEMINI_API_KEY_2!,
    process.env.GOOGLE_GEMINI_API_KEY_3!,
  ];

  const RANDOM_GEMINI_API_KEY = keys[Math.floor(Math.random() * keys.length)];

  const google = createGoogleGenerativeAI({
    apiKey: RANDOM_GEMINI_API_KEY,
  });

  const { text } = await generateText({
    temperature: 0.8,
    model: google(GEMINI_THINKING, {
      //   safetySettings: [
      //     {
      //       category: "HARM_CATEGORY_HARASSMENT",
      //       threshold: "BLOCK_NONE",
      //     },
      //   ],
    }),
    messages: theMessages,
  });
  console.log("🔴 text", text);

  const cleanedResponse = text.replace(/```json\n/g, "").replace(/\n```/g, "");

  const theTweet = JSON.parse(cleanedResponse).content;
  console.log("🔴 theTweet", theTweet);
  const reasoning = JSON.parse(cleanedResponse).reasoning;
  console.log("🔴 reasoning", reasoning);

  // create the action_event
  const newActionEvent = {
    top_level_type: "individual",
    action_type: "tweet_an_idea",
    from_handle: user.handle,
    main_output: theTweet,
    story_context: reasoning,
    to_handle: null,
    extra_data: null,
    created_at: new Date(),
  } as ActionEvent;

  await saveNewActionEvent(newActionEvent);

  console.log("🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴 newActionEvent", newActionEvent);

  return theTweet;
};
