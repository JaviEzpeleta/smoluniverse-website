import { INDIVIDUAL_ACTIONS } from "./actions-catalog";
import { postErrorToDiscord, postToDiscord } from "./discord";
import { askGeminiThinking } from "./gemini";
import { generateGliffWojakMeme } from "./gliff";
import {
  readIRLTweets,
  getRandomClone,
  saveNewActionEvent,
  saveNewSmolTweet,
  saveNewLifeGoalsChange,
  updateUserLifeGoals,
} from "./postgres";
import { getListOfIRLTweetsAsString } from "./prompts";
import { ActionEvent, LifeGoalsChange, RawUser, SmolTweet } from "./types";
import { SavedTweet } from "./types";

import { CoreMessage } from "ai";

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
    case "tweet_a_feeling":
      await executeTweetAFelling({ user, tweets });
      break;
    case "tweet_a_wojak_meme":
      await executeTweetAWojakMeme({ user, tweets });
      break;
    case "learn_something_new":
      await executeLearnSomethingNew({ user, tweets });
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
      content: `You are a story teller for an AI clone emulation universe. Based on this character profile and recent tweets, now in this moment of the story, the character will write a tweet about a idea that just had.
        
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

## Recent publications:
${getListOfIRLTweetsAsString({
  handle: user.handle,
  userIRLTweets: tweets,
})}

<Important>Do not use hashtags or emojis in the tweet. Try to be creative, original and a bit random. Also try to use the same tone and style of the user's previous tweets.</Important>`,
    },
  ] as CoreMessage[];

  const responseFromGemini = await askGeminiThinking({
    messages: theMessages,
    temperature: 0.8,
  });

  console.log("🔴 responseFromGemini", responseFromGemini);

  const cleanedResponse = responseFromGemini
    .replace(/```json\n/g, "")
    .replace(/\n```/g, "");

  const theTweet = JSON.parse(cleanedResponse).content;
  console.log("🔴 theTweet", theTweet);
  const reasoning = JSON.parse(cleanedResponse).reasoning;
  console.log("🔴 reasoning", reasoning);

  // create the action_event
  const newActionEvent = {
    top_level_type: "individual",
    action_type: "tweet_an_idea",
    from_handle: user.handle,
    main_output: JSON.stringify({
      tweet: theTweet,
    }),
    story_context: reasoning,
    to_handle: null,
    extra_data: null,
    created_at: new Date(),
  } as ActionEvent;

  await saveNewActionEvent(newActionEvent);

  await actionImpactLifeGoals({
    action: newActionEvent,
    profile: user,
    tweets: tweets,
  });

  const newSmolTweet = {
    handle: user.handle,
    content: theTweet,
    link: null,
    image_url: null,
    created_at: new Date(),
  } as SmolTweet;

  await saveNewSmolTweet(newSmolTweet);

  console.log("🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴 newActionEvent", newActionEvent);

  return theTweet;
};

const executeTweetAFelling = async ({
  user,
  tweets,
}: {
  user: RawUser;
  tweets: SavedTweet[];
}) => {
  const theMessages = [
    {
      role: "system",
      content: `You are a story teller for an AI clone emulation universe. Based on this character profile and recent tweets, now in this moment of the story, the character will write a tweet about a feeling they're feeling.

It can be a feeling of love, sadness, happiness, anger, etc...

So the tweet should be about a feeling (and a very small explanation/context around it)
        
Reply in JSON format: 
{
  "content": "the tweet content about the feeling the user is feeling", // can be in markdown format
  "reasoning": "the reasoning behind the game character's feelings and thoughts that caused that feeling"
}`,
    },
    {
      role: "user",
      content: `Full character profile:
${JSON.stringify(user)}

## Recent publications:
${getListOfIRLTweetsAsString({
  handle: user.handle,
  userIRLTweets: tweets,
})}

<Important>Do not use hashtags or emojis in the tweet. Try to be creative, original and a bit random. Also try to use the same tone and style of the user's previous tweets.</Important>`,
    },
  ] as CoreMessage[];

  const responseFromGemini = await askGeminiThinking({
    messages: theMessages,
    temperature: 0.8,
  });

  console.log("🔴 responseFromGemini", responseFromGemini);

  const cleanedResponse = responseFromGemini
    .replace(/```json\n/g, "")
    .replace(/\n```/g, "");

  const theTweet = JSON.parse(cleanedResponse).content;
  console.log("🔴 theTweet", theTweet);
  const reasoning = JSON.parse(cleanedResponse).reasoning;
  console.log("🔴 reasoning", reasoning);

  // create the action_event
  const newActionEvent = {
    top_level_type: "individual",
    action_type: "tweet_a_feeling",
    from_handle: user.handle,
    main_output: JSON.stringify({
      tweet: theTweet,
    }),
    story_context: reasoning,
    to_handle: null,
    extra_data: null,
    created_at: new Date(),
  } as ActionEvent;

  await saveNewActionEvent(newActionEvent);

  const newSmolTweet = {
    handle: user.handle,
    content: theTweet,
    link: null,
    image_url: null,
    created_at: new Date(),
  } as SmolTweet;

  await saveNewSmolTweet(newSmolTweet);

  console.log("🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴 newActionEvent", newActionEvent);

  return theTweet;
};

const executeTweetAWojakMeme = async ({
  user,
  tweets,
}: {
  user: RawUser;
  tweets: SavedTweet[];
}) => {
  const theMessages = [
    {
      role: "system",
      content: `You are a story teller for an AI clone emulation universe entertainment app. Based on this character profile and recent tweets, please generate a topic description to creare a wojak meme from it. 
Something that's interesting and connected to the character's personality and recent tweets.
        
Reply in JSON format: 
{
  "content": "", // theme for a wojak meme
  "tweet_content": "", // when the user tweets the meme image, this will be the text that will be displayed next to the image, as an intro or something. Do NOT include any hashtags or emojis.
  "reasoning": "" // the reasoning behind picking this subject for a wojak meme
}`,
    },
    {
      role: "user",
      content: `Full character profile:
${JSON.stringify(user)}

## Recent publications:
${getListOfIRLTweetsAsString({
  handle: user.handle,
  userIRLTweets: tweets,
})}

<Important>Reply directly with the theme in plain text format, no markdown or other formatting.</Important>`,
    },
  ] as CoreMessage[];

  const responseFromGemini = await askGeminiThinking({
    messages: theMessages,
    temperature: 0.8,
  });

  console.log("🔴 responseFromGemini", responseFromGemini);

  const cleanedResponse = responseFromGemini
    .replace(/```json\n/g, "")
    .replace(/\n```/g, "");

  const theContent = JSON.parse(cleanedResponse).content;
  console.log("🔴 theContent", theContent);
  const tweetContent = JSON.parse(cleanedResponse).tweet_content;
  console.log("🔴 tweetContent", tweetContent);
  const reasoning = JSON.parse(cleanedResponse).reasoning;
  console.log("🔴 reasoning", reasoning);

  const gliffImage = await generateGliffWojakMeme(theContent);

  console.log("🔴 gliffImage", gliffImage);

  // create the action_event
  const newActionEvent = {
    top_level_type: "individual",
    action_type: "tweet_a_wojak_meme",
    from_handle: user.handle,
    main_output: JSON.stringify({
      tweet: tweetContent,
      image_url: gliffImage,
    }),
    story_context: reasoning,
    to_handle: null,
    extra_data: null,
    created_at: new Date(),
  } as ActionEvent;

  await saveNewActionEvent(newActionEvent);

  const newSmolTweet = {
    handle: user.handle,
    content: tweetContent,
    link: null,
    image_url: gliffImage,
    created_at: new Date(),
  } as SmolTweet;

  await saveNewSmolTweet(newSmolTweet);

  // console.log("🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴 newActionEvent", newActionEvent);

  return responseFromGemini;
};

const executeLearnSomethingNew = async ({
  user,
  tweets,
}: {
  user: RawUser;
  tweets: SavedTweet[];
}) => {
  const theMessages = [
    {
      role: "system",
      content: `You are an amazing storyteller for an AI clone emulation universe, where the "users" are ai clones based on twitter profiles, and have money in web3 and do things onchain.

Based on this character profile and recent tweets, now in this moment of the story, the character will decide to learn something now, and that can help improve their skill levels or even add a new skill.


So please come up with some creative original new idea for something new to learn by the character of the story.

The character will compose a tweet about the new skill they will learn to share it with the rest of the characters in the story.

Reply in JSON format: 
{
  "new_skill": "", // the new skill the user will learn
  "content": "", // the tweet content about the new skill the user will learn, can be in markdown format
  "reasoning": "" // the reasoning behind the game character's feelings and thoughts that caused that feeling
}`,
    },
    {
      role: "user",
      content: `Full character profile:
${JSON.stringify(user)}

## Recent publications:
${getListOfIRLTweetsAsString({
  handle: user.handle,
  userIRLTweets: tweets,
})}

<Important>Do not use hashtags or emojis in the tweet. Try to be creative, original and a bit random. Also try to use the same tone and style of the user's previous tweets.</Important>`,
    },
  ] as CoreMessage[];

  const responseFromGemini = await askGeminiThinking({
    messages: theMessages,
    temperature: 0.8,
  });

  console.log("🔴 responseFromGemini", responseFromGemini);

  const cleanedResponse = responseFromGemini
    .replace(/```json\n/g, "")
    .replace(/\n```/g, "");

  const theTweet = JSON.parse(cleanedResponse).content;
  console.log("🔴 theTweet", theTweet);
  const reasoning = JSON.parse(cleanedResponse).reasoning;
  console.log("🔴 reasoning", reasoning);
  const newSkill = JSON.parse(cleanedResponse).new_skill;
  console.log("🔴 newSkill", newSkill);

  // // create the action_event
  const newActionEvent = {
    top_level_type: "individual",
    action_type: "learn_something_new",
    from_handle: user.handle,
    main_output: JSON.stringify({
      tweet: theTweet,
      new_skill: newSkill,
    }),
    story_context: reasoning,
    to_handle: null, // ! igual quito esto?
    extra_data: null, // ! igual quito esto?
    created_at: new Date(),
  } as ActionEvent;

  console.log("🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴 newActionEvent", newActionEvent);

  await actionImpactLifeGoals({
    action: newActionEvent,
    profile: user,
    tweets: tweets,
  });

  // console.log("🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴 newLifeGoals", newLifeGoals);

  // await saveNewActionEvent(newActionEvent);

  // const newSmolTweet = {
  //   handle: user.handle,
  //   content: theTweet,
  //   link: null,
  //   image_url: null,
  //   created_at: new Date(),
  // } as SmolTweet;

  // await saveNewSmolTweet(newSmolTweet);

  // console.log("🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴 newActionEvent", newActionEvent);

  return theTweet;
};

const actionImpactLifeGoals = async ({
  action,
  profile,
  tweets,
}: {
  action: ActionEvent;
  profile: RawUser;
  tweets: SavedTweet[];
}) => {
  // ! the goal here is to see if the action can alter the user's life goals.

  const messages = [
    {
      role: "system",
      content: `You are a story teller for an AI clone emulation universe. Based on this character profile and an action that just happened on the story (${action.action_type}),
you have to determine if that action can somehow impact and alter the user's list of life goals. 

The user will provide you with some previous context, the description of the action, and the current list of life goals. 


<Important>
  - if you consider that the action should alter the user's life goals, you should return a JSON object with this structure: 
{
  "new_life_goals": "" // the complete list of updated life goals, in markdown format. 
  "summary_of_the_changes": "" // the reasoning behind what changed in the user's life goals list, in markdown format.
}  
  - but, if you consider that the action does not alter the user's life goals, please simply reply with the word "NO".
</Important>`,
    },
    {
      role: "user",
      content: `

Full context on the user: 
- Name: ${profile.display_name}
- Handle: ${profile.handle}

- Current Life Goals: 
${profile.life_goals}

- Current skills: 
${JSON.stringify(profile.skills)}

- Current Life Context: 
${JSON.stringify(profile.life_context)}

- Recent publications:
${getListOfIRLTweetsAsString({
  handle: profile.handle,
  userIRLTweets: tweets,
})}

## Recent action that just happened:
${JSON.stringify(action)}

<Important>
  - if you consider that the action should alter the user's life goals, you should return a the complete list of updated life goals, in markdown format. 
  - but, if you consider that the action does not alter the user's life goals, please simply reply with the word "NO".
</Important>`,
    },
  ] as CoreMessage[];

  const responseFromGemini = await askGeminiThinking({
    messages,
    temperature: 0.8,
  });

  console.log("🔴 responseFromGemini", responseFromGemini);

  const cleanedResponse = responseFromGemini
    .replace(/```json\n/g, "")
    .replace(/\n```/g, "");

  if (cleanedResponse.trim() === "NO" || cleanedResponse.trim().length < 30) {
    await postToDiscord(
      `🔴 ${profile.handle} did not alter their life goals with the action: ${action.action_type}`
    );
    return;
  } else {
    await postToDiscord(
      `✅ ${profile.handle} altered their life goals with the action: ${action.action_type}`
    );

    const newLifeGoals = JSON.parse(cleanedResponse).new_life_goals;
    const summaryOfTheChanges =
      JSON.parse(cleanedResponse).summary_of_the_changes;
    // now it's time to update the user's life goals
    // but first, we react the change:
    const lifeGoalsChange = {
      handle: profile.handle,
      previous_life_goals: profile.life_goals,
      new_life_goals: newLifeGoals,
      summary_of_the_changes: summaryOfTheChanges,
      created_at: new Date().toISOString(),
    } as LifeGoalsChange;

    await saveNewLifeGoalsChange(lifeGoalsChange);

    // now we update the user's life goals
    await updateUserLifeGoals(profile.handle, newLifeGoals);
  }

  return;
};
