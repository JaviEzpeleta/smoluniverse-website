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
  saveNewSkillsChange,
  updateUserSkills,
  saveNewLifeContextChange,
  updateUserLifeContext,
} from "./postgres";
import { getListOfIRLTweetsAsString } from "./prompts";
import { generateRecraftImage } from "./replicate";
import {
  ActionEvent,
  LifeContextChange,
  LifeGoalsChange,
  RawUser,
  SkillsChange,
  SmolTweet,
} from "./types";
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
    case "release_a_side_hustle":
      await executeReleaseASideHustle({ user, tweets });
      break;
    case "travel_to_a_new_place":
      await executeTravelToANewPlace({ user, tweets });
      break;
    case "create_art_nft":
      await executeCreateArtNft({ user, tweets });
      break;
    case "take_a_selfie":
      await executeTakeASelfie({ user, tweets });
      break;
    case "something_amazing_happens":
      await executeSomethingAmazingHappens({ user, tweets });
      break;
    case "something_terrible_happens":
      await executeSomethingTerribleHappens({ user, tweets });
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
  await processActionImpact({
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
  await processActionImpact({
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

  // ! ok.. for now.. this will not affect the user's life goals or skills or anything. it's just a meme!!

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

  await processActionImpact({
    action: newActionEvent,
    profile: user,
    tweets: tweets,
  });

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

const executeReleaseASideHustle = async ({
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

Based on this character profile and recent tweets, now in this moment of the story, the character will decide to release a side hustle, with the intention of making some extra money.

So please come up with some creative original new idea for a new way for the clone to make some extra money in this virtual universe.

The character will compose a tweet to publicly announce the new side hustle on a social network.

Reply in JSON format: 
{
  "side_hustle": "", // the new side hustle the user will release
  "content": "", // the tweet content about the new side hustle the user will release, can be in markdown format
  "reasoning": "" // the reasoning behind the game character's situation that caused them to release this side hustle
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
  const sideHustle = JSON.parse(cleanedResponse).side_hustle;
  console.log("🔴 sideHustle", sideHustle);

  // // create the action_event
  const newActionEvent = {
    top_level_type: "individual",
    action_type: "release_a_side_hustle",
    from_handle: user.handle,
    main_output: JSON.stringify({
      tweet: theTweet,
      side_hustle: sideHustle,
    }),
    story_context: reasoning,
    to_handle: null, // ! igual quito esto?
    extra_data: null, // ! igual quito esto?
    created_at: new Date(),
  } as ActionEvent;

  console.log("🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴 newActionEvent", newActionEvent);

  await processActionImpact({
    action: newActionEvent,
    profile: user,
    tweets: tweets,
  });

  await saveNewActionEvent(newActionEvent);

  const newSmolTweet = {
    handle: user.handle,
    content: theTweet,
    link: null,
    image_url: null,
    created_at: new Date(),
  } as SmolTweet;

  await saveNewSmolTweet(newSmolTweet);

  return theTweet;
};

const executeTravelToANewPlace = async ({
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

Based on this character profile and recent tweets, now in this moment of the story, the character will decide to travel to a new place.

So please come up with some creative original new idea for a new place for the clone to travel to in this virtual universe.

The character will compose a tweet to publicly announce the new place they will travel to.

Reply in JSON format: 
{
  "new_place": "", // the new place the user will travel. Please Include the city and an emoji for the country flag.
  "content": "", // the tweet content about the new place the user will travel to, can be in markdown format
  "reasoning": "" // the reasoning behind the game character's situation that caused them to travel to this new place
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
  const newPlace = JSON.parse(cleanedResponse).new_place;
  console.log("🔴 newPlace", newPlace);

  // // create the action_event
  const newActionEvent = {
    top_level_type: "individual",
    action_type: "travel_to_a_new_place",
    from_handle: user.handle,
    main_output: JSON.stringify({
      tweet: theTweet,
      new_place: newPlace,
    }),
    story_context: reasoning,
    to_handle: null, // ! igual quito esto?
    extra_data: null, // ! igual quito esto?
    created_at: new Date(),
  } as ActionEvent;

  console.log("🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴 newActionEvent", newActionEvent);

  await processActionImpact({
    action: newActionEvent,
    profile: user,
    tweets: tweets,
  });

  await saveNewActionEvent(newActionEvent);

  const newSmolTweet = {
    handle: user.handle,
    content: theTweet,
    link: null,
    image_url: null,
    created_at: new Date(),
  } as SmolTweet;

  await saveNewSmolTweet(newSmolTweet);

  return theTweet;
};

const executeSomethingAmazingHappens = async ({
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

Based on this character profile and recent tweets, now in this moment of the story, something amazing happens to the character. Something that is not normal or expected. Something that changes the user's storyline in a huge possitive way.

The character will compose a tweet to publicly announce the big news with joy!

Reply in JSON format: 
{
  "amazing_thing": "", // the amazing thing that happened to the user.
  "content": "", // the tweet content about the amazing thing that happened to the user, can be in markdown format, but make it just 2 short sentences, in a super friendly casual tone.
  "reasoning": "" // the reasoning behind the game character's situation that caused them to travel to this new place
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

<Important>Do not use hashtags or emojis in the tweet. Try to be creative, and original. Don't repeat things from the past. Bring something new. Also try to use the same tone and style of the user's previous tweets.</Important>`,
    },
  ] as CoreMessage[];

  const responseFromGemini = await askGeminiThinking({
    messages: theMessages,
    temperature: 0.44,
  });

  console.log("🔴 responseFromGemini", responseFromGemini);

  const cleanedResponse = responseFromGemini
    .replace(/```json\n/g, "")
    .replace(/\n```/g, "");

  const theTweet = JSON.parse(cleanedResponse).content;
  console.log("🔴 theTweet", theTweet);
  const reasoning = JSON.parse(cleanedResponse).reasoning;
  console.log("🔴 reasoning", reasoning);
  const amazingThing = JSON.parse(cleanedResponse).amazing_thing;
  console.log("🔴 amazingThing", amazingThing);

  // // create the action_event
  const newActionEvent = {
    top_level_type: "individual",
    action_type: "something_amazing_happens",
    from_handle: user.handle,
    main_output: JSON.stringify({
      tweet: theTweet,
      amazing_thing: amazingThing,
    }),
    story_context: reasoning,
    to_handle: null,
    extra_data: null,
    created_at: new Date(),
  } as ActionEvent;

  console.log("🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴 newActionEvent", newActionEvent);

  await processActionImpact({
    action: newActionEvent,
    profile: user,
    tweets: tweets,
  });

  await saveNewActionEvent(newActionEvent);

  const newSmolTweet = {
    handle: user.handle,
    content: theTweet,
    link: null,
    image_url: null,
    created_at: new Date(),
  } as SmolTweet;

  await saveNewSmolTweet(newSmolTweet);

  return theTweet;
};

const executeSomethingTerribleHappens = async ({
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

Based on this character profile and recent tweets, now in this moment of the story, something terrible happens to the character. Something that is not normal or expected. Something that changes the user's storyline in a huge negative way.

The character will compose a tweet to publicly announce the big news with joy!

Reply in JSON format: 
{
  "terrible_thing": "", // the terrible thing that happened to the user.
  "content": "", // the tweet content about the terrible thing that happened to the user, can be in markdown format, but make it just 2 short sentences, in a super friendly casual tone.
  "reasoning": "" // the reasoning behind the game character's situation that caused them to travel to this new place
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

<Important>Do not use hashtags or emojis in the tweet. Try to be creative, and original. Don't repeat things from the past. Bring something new. Also try to use the same tone and style of the user's previous tweets.</Important>`,
    },
  ] as CoreMessage[];

  const responseFromGemini = await askGeminiThinking({
    messages: theMessages,
    temperature: 0.33,
  });

  console.log("🔴 responseFromGemini", responseFromGemini);

  const cleanedResponse = responseFromGemini
    .replace(/```json\n/g, "")
    .replace(/\n```/g, "");

  const theTweet = JSON.parse(cleanedResponse).content;
  console.log("🔴 theTweet", theTweet);
  const reasoning = JSON.parse(cleanedResponse).reasoning;
  console.log("🔴 reasoning", reasoning);
  const terribleThing = JSON.parse(cleanedResponse).terrible_thing;
  console.log("🔴 terribleThing", terribleThing);

  // // create the action_event
  const newActionEvent = {
    top_level_type: "individual",
    action_type: "something_terrible_happens",
    from_handle: user.handle,
    main_output: JSON.stringify({
      tweet: theTweet,
      terrible_thing: terribleThing,
    }),
    story_context: reasoning,
    to_handle: null,
    extra_data: null,
    created_at: new Date(),
  } as ActionEvent;

  console.log("🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴 newActionEvent", newActionEvent);

  await processActionImpact({
    action: newActionEvent,
    profile: user,
    tweets: tweets,
  });

  await saveNewActionEvent(newActionEvent);

  const newSmolTweet = {
    handle: user.handle,
    content: theTweet,
    link: null,
    image_url: null,
    created_at: new Date(),
  } as SmolTweet;

  await saveNewSmolTweet(newSmolTweet);

  return theTweet;
};

const executeCreateArtNft = async ({
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

Based on this character profile and recent tweets, now in this moment of the story, the character decides to create a piece of art and launch it as an NFT.

So please come up with some creative original prompt for a new piece of art for the clone to create and launch as an NFT.

We will use that prompt with another AI model to create the art.

The user will tweet something about the art they will create and launch as an NFT, so give me the tweet content too.

Reply in JSON format: 
{
  "art_prompt": "", // the prompt for the artwork. If you feel it, it can contain specific locations, and text too, but try to avoid including people. Make it be very artistic and deep.
  "content": "", // the tweet content about the new art the user will create and launch as an NFT, can be in markdown format
  "reasoning": "" // the reasoning behind the game character's situation that caused them to create this art
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
  const artPrompt = JSON.parse(cleanedResponse).art_prompt;
  console.log("🔴 artPrompt", artPrompt);

  await postToDiscord(`Prompt for art: ${artPrompt}`);

  const artworkUrl = await generateRecraftImage({
    prompt: artPrompt,
    handle: user.handle,
  });

  if (!artworkUrl) {
    await postToDiscord(`💥 Error generating artwork for ${user.handle}`);
    return;
  }

  // create the action_event
  const newActionEvent = {
    top_level_type: "individual",
    action_type: "create_art_nft",
    from_handle: user.handle,
    main_output: JSON.stringify({
      tweet: theTweet,
      artwork_url: artworkUrl,
      art_prompt: artPrompt,
    }),
    story_context: reasoning,
    to_handle: null, // ! igual quito esto?
    extra_data: null, // ! igual quito esto?
    created_at: new Date(),
  } as ActionEvent;

  console.log("🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴 newActionEvent", newActionEvent);

  await processActionImpact({
    action: newActionEvent,
    profile: user,
    tweets: tweets,
  });

  await saveNewActionEvent(newActionEvent);

  const newSmolTweet = {
    handle: user.handle,
    content: theTweet,
    link: null,
    image_url: artworkUrl,
    created_at: new Date(),
  } as SmolTweet;

  await saveNewSmolTweet(newSmolTweet);

  return theTweet;
};

const executeTakeASelfie = async ({
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

Based on this character profile and recent tweets, now in this moment of the story, the character decides to take a selfie.

So please come up with some creative original prompt for a selfie realsitic picture for the clone to take.

The user will tweet something about the selfie they will take, so give me the tweet content too.

Reply in JSON format: 
{
  "selfie_prompt": "", // the prompt for the selfie image. If you feel it, it can contain specific locations, and text too. Make it very realistic. Please include in the prompt that is a "Facebook selfie from 2015, raw.". Please do not include names.
  "content": "", // the tweet content about the new selfie the user will take, can be in markdown format
  "reasoning": "" // the reasoning behind the game character's situation that caused them to take this selfie
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
  const selfiePrompt = JSON.parse(cleanedResponse).selfie_prompt;
  console.log("🔴 selfiePrompt", selfiePrompt);

  await postToDiscord(`Prompt for selfie: ${selfiePrompt}`);

  const selfieUrl = await generateRecraftImage({
    prompt: selfiePrompt,
    handle: user.handle,
    portraitMode: true,
  });

  if (!selfieUrl) {
    await postToDiscord(`💥 Error generating selfie for ${user.handle}`);
    return;
  }

  // create the action_event
  const newActionEvent = {
    top_level_type: "individual",
    action_type: "take_a_selfie",
    from_handle: user.handle,
    main_output: JSON.stringify({
      tweet: theTweet,
      selfie_url: selfieUrl,
      selfie_prompt: selfiePrompt,
    }),
    story_context: reasoning,
    to_handle: null,
    extra_data: null,
    created_at: new Date(),
  } as ActionEvent;

  console.log("🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴 newActionEvent", newActionEvent);

  // ! Not needed, I think!!
  // await processActionImpact({
  //   action: newActionEvent,
  //   profile: user,
  //   tweets: tweets,
  // });

  await saveNewActionEvent(newActionEvent);

  const newSmolTweet = {
    handle: user.handle,
    content: theTweet,
    link: null,
    image_url: selfieUrl,
    created_at: new Date(),
  } as SmolTweet;

  await saveNewSmolTweet(newSmolTweet);

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

    await postToDiscord(
      `✅ ${profile.handle} altered their life goals with the action: ${action.action_type}:` +
        `\n\n${summaryOfTheChanges}`
    );

    await saveNewLifeGoalsChange(lifeGoalsChange);

    await saveNewLifeGoalsChange(lifeGoalsChange);

    // now we update the user's life goals
    await updateUserLifeGoals(profile.handle, newLifeGoals);
  }

  return;
};

const actionImpactSkills = async ({
  action,
  profile,
  tweets,
}: {
  action: ActionEvent;
  profile: RawUser;
  tweets: SavedTweet[];
}) => {
  // ! the goal here is to see if the action can alter the user's skills.

  const messages = [
    {
      role: "system",
      content: `You are a story teller for an AI clone emulation universe. Based on this character profile and an action that just happened on the story (${action.action_type}),
you have to determine if that action can somehow impact and alter the user's list of skills. 

The user will provide you with some previous context, the description of the action, and the current list of skills. 


<Important>
  - if you consider that the action should alter the user's skills, you should return a JSON object with this structure: 
{
  "new_skills": "" // the complete list of updated skills, in the same JSON format as the current skills.
  "summary_of_the_changes": "" // the reasoning behind what changed in the user's skills list, in markdown format.
}  
  - but, if you consider that the action does not alter the user's skills, please simply reply with the word "NO".
</Important>`,
    },
    {
      role: "user",
      content: `

Full context on the user: 
- Name: ${profile.display_name}
- Handle: ${profile.handle}

- Current life goals: 
${profile.life_goals}

- Current skills: 
${JSON.stringify(profile.skills)}

- Current life context: 
${JSON.stringify(profile.life_context)}

- Recent publications:
${getListOfIRLTweetsAsString({
  handle: profile.handle,
  userIRLTweets: tweets,
})}

## Recent action that just happened:
${JSON.stringify(action)}

<Important>
  - if you consider that the action should alter the user's skills or skill levels, you should return a the complete list of updated skills, in the same JSON format as the current skills.
  - but, if you consider that the action does not alter the user's skills or skill levels, please simply reply with the word "NO".
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
      `🔴 ${profile.handle} did not alter their skills with the action: ${action.action_type}`
    );
    return;
  } else {
    const newSkills = JSON.parse(cleanedResponse).new_skills;
    const summaryOfTheChanges =
      JSON.parse(cleanedResponse).summary_of_the_changes;
    // now it's time to update the user's skills
    // but first, we react the change:
    const skillsChange = {
      handle: profile.handle,
      previous_skills: profile.skills,
      new_skills: newSkills,
      summary_of_the_changes: summaryOfTheChanges,
      created_at: new Date().toISOString(),
    } as SkillsChange;

    await postToDiscord(
      `✅ ${profile.handle} altered their skills with the action: ${action.action_type}:` +
        `\n\n${summaryOfTheChanges}`
    );

    await saveNewSkillsChange(skillsChange);

    // now we update the user's skills
    await updateUserSkills(profile.handle, newSkills);
  }

  return;
};

const actionImpactLifeContext = async ({
  action,
  profile,
  tweets,
}: {
  action: ActionEvent;
  profile: RawUser;
  tweets: SavedTweet[];
}) => {
  // ! the goal here is to see if the action can alter the user's life context: relationship status, location, salary and incomes, and expenses...

  const messages = [
    {
      role: "system",
      content: `You are a story teller for an AI clone emulation universe. Based on this character profile and an action that just happened on the story (${action.action_type}),
you have to determine if that action can somehow impact and alter the user's ife context (relationship status, location, salary and incomes, and expenses)

The user will provide you with some previous context, the description of the action, and the current life context. 

<Important>
  - if you consider that the action should alter the user's life context in a significant way, you should return a JSON object with this structure: 
{
  "new_life_context": "" // the complete new life context object, in the same JSON format as the current life context.
  "summary_of_the_changes": "" // the reasoning behind what changed in the user's life context, in markdown format.
}  
  - but, if you consider that the action does not alter the user's life context, please simply reply with the word "NO".
</Important>`,
    },
    {
      role: "user",
      content: `

Full context on the user: 
- Name: ${profile.display_name}
- Handle: ${profile.handle}

- Current life goals: 
${profile.life_goals}

- Current skills: 
${JSON.stringify(profile.skills)}

- Current life context: 
${JSON.stringify(profile.life_context)}

- Recent publications:
${getListOfIRLTweetsAsString({
  handle: profile.handle,
  userIRLTweets: tweets,
})}

## Recent action that just happened:
${JSON.stringify(action)}

<Important>
  - if you consider that the action should alter the user's life context in a significant way, you should return a the complete new life context object, in the same JSON format as the current life context.
  - but, if you consider that the action does not alter the user's life context, please simply reply with the word "NO".
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
      `🔴 ${profile.handle} did not alter their life context with the action: ${action.action_type}`
    );
    return;
  } else {
    const newLifeContext = JSON.parse(cleanedResponse).new_life_context;
    const summaryOfTheChanges =
      JSON.parse(cleanedResponse).summary_of_the_changes;
    // now it's time to update the user's life context
    // but first, we react the change:

    await postToDiscord(
      `✅ ${profile.handle} altered their life context with the action: ${action.action_type}:` +
        `\n\n${summaryOfTheChanges}`
    );

    const lifeContextChange = {
      handle: profile.handle,
      previous_life_context: profile.life_context,
      new_life_context: newLifeContext,
      summary_of_the_changes: summaryOfTheChanges,
      created_at: new Date().toISOString(),
    } as LifeContextChange;

    await saveNewLifeContextChange(lifeContextChange);

    // now we update the user's life context
    await updateUserLifeContext(profile.handle, newLifeContext);
  }

  return;
};

const processActionImpact = async ({
  action,
  profile,
  tweets,
}: {
  action: ActionEvent;
  profile: RawUser;
  tweets: SavedTweet[];
}) => {
  await actionImpactLifeGoals({
    action,
    profile,
    tweets,
  });
  await actionImpactSkills({
    action,
    profile,
    tweets,
  });
  await actionImpactLifeContext({
    action,
    profile,
    tweets,
  });
};
