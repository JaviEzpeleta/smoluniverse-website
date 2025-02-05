import { ACTIONS_OBJECT, INDIVIDUAL_ACTIONS } from "./actions-catalog";
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
import { generateRecraftImage, generateVoiceNoteAudioFile } from "./replicate";
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
      ACTIONS_OBJECT[Math.floor(Math.random() * ACTIONS_OBJECT.length)];

    const randomClone = await getRandomClone();
    if (!randomClone) {
      await postErrorToDiscord(
        "🔴 Error in createNewRandomEvent(): no random clone found"
      );
      return "no random clone found";
    }

    const referenceCloneTweets = await readIRLTweets({
      handle: randomClone.handle,
    });
    await executeIndividualAction({
      user: randomClone,
      action_type: randomAction.code,
      tweets: referenceCloneTweets,
    });

    return { top_level_type: "individual", action: randomAction };
  }

  return "unsupported main type: " + mainType;
};

export const executeIndividualAction = async ({
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
    case "write_a_haiku":
      await executeWriteAHaiku({ user, tweets, temperature: 0.25 });
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
    case "share_a_photo_of_where_you_are":
      await executeShareAPictureOfWhereYouAre({ user, tweets });
      break;
    case "something_amazing_happens":
      await executeSomethingAmazingHappens({ user, tweets });
      break;
    case "something_terrible_happens":
      await executeSomethingTerribleHappens({ user, tweets });
      break;
    case "send_a_voice_note":
      await executeSendAVoiceNote({ user, tweets });
      break;
    case "tweet_a_dad_joke":
      await executeTweetADadJoke({ user, tweets });
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

  console.log("✅ finished generating tweet idea");

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

  const newActionId = await saveNewActionEvent(newActionEvent);
  if (!newActionId) {
    await postErrorToDiscord(
      `🔴 Error in executeTweetAnIdea: newActionId is null for user ${user.handle}`
    );
    return;
  }
  await processActionImpact({
    action: newActionEvent,
    actionId: newActionId,
    profile: user,
    tweets: tweets,
  });

  const newSmolTweet = {
    handle: user.handle,
    content: theTweet,
    link: null,
    image_url: null,
    created_at: new Date(),
    action_type: "tweet_an_idea",
    action_id: newActionId,
  };

  await saveNewSmolTweet(newSmolTweet);

  console.log("🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴 newActionEvent", newActionEvent);

  return theTweet;
};

const executeWriteAHaiku = async ({
  user,
  tweets,
  temperature,
}: {
  user: RawUser;
  tweets: SavedTweet[];
  temperature: number;
}) => {
  const theMessages = [
    {
      role: "system",
      content: `You are a story teller for an AI clone emulation universe. Based on this character profile and recent tweets, now in this moment of the story, the character will write a haiku.
        
Reply in JSON format: 
{
  "content": "the tweet content about the idea the user had", // can be in markdown format
  "reasoning": "the reasoning behind the game character's feelings and thoughts that caused that idea"
}
  
## The tweet can be something like: 
<TweetExample>
  i wrote a haiku about [__topic__]

  _the haiku divided into separated lines_
</TweetExample>
`,
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
`,
    },
  ] as CoreMessage[];

  const responseFromGemini = await askGeminiThinking({
    messages: theMessages,
    temperature,
  });

  console.log("✅ finished generating tweet idea");

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
    action_type: "write_a_haiku",
    from_handle: user.handle,
    main_output: JSON.stringify({
      tweet: theTweet,
    }),
    story_context: reasoning,
    to_handle: null,
    extra_data: null,
    created_at: new Date(),
  } as ActionEvent;

  const newActionId = await saveNewActionEvent(newActionEvent);
  if (!newActionId) {
    await postErrorToDiscord(
      `🔴 Error in executeWriteAHaiku: newActionId is null for user ${user.handle}`
    );
    return;
  }

  const newSmolTweet = {
    handle: user.handle,
    content: theTweet,
    link: null,
    image_url: null,
    created_at: new Date(),
    action_type: "write_a_haiku",
    action_id: newActionId,
  };

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

  // console.log("🔴 responseFromGemini", responseFromGemini);
  console.log("✅ finished generating tweet a feeling");

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

  const newActionId = await saveNewActionEvent(newActionEvent);
  if (!newActionId) {
    await postErrorToDiscord(
      `🔴 Error in executeTweetAFelling: newActionId is null for user ${user.handle}`
    );
    return;
  }
  await processActionImpact({
    action: newActionEvent,
    actionId: newActionId,
    profile: user,
    tweets: tweets,
  });

  const newSmolTweet = {
    handle: user.handle,
    content: theTweet,
    link: null,
    image_url: null,
    created_at: new Date(),
    action_type: "tweet_a_feeling",
    action_id: newActionId,
  };

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

  // console.log("🔴 responseFromGemini", responseFromGemini);
  console.log("✅ finished generating tweet a wojak meme");

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

  const newActionId = await saveNewActionEvent(newActionEvent);
  if (!newActionId) {
    await postErrorToDiscord(
      `🔴 Error in executeTweetAWojakMeme: newActionId is null for user ${user.handle}`
    );
    return;
  }

  // ! ok.. for now.. this will not affect the user's life goals or skills or anything. it's just a meme!!

  const newSmolTweet = {
    handle: user.handle,
    content: tweetContent,
    link: null,
    image_url: gliffImage,
    created_at: new Date(),
    action_type: "tweet_a_wojak_meme",
    action_id: newActionId,
  };

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

  // console.log("🔴 responseFromGemini", responseFromGemini);
  console.log("✅ finished generating learn something new");

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

  const newActionId = await saveNewActionEvent(newActionEvent);
  if (!newActionId) {
    await postErrorToDiscord(
      `🔴 Error in executeLearnSomethingNew: newActionId is null for user ${user.handle}`
    );
    return;
  }

  await processActionImpact({
    action: newActionEvent,
    actionId: newActionId,
    profile: user,
    tweets: tweets,
  });

  const newSmolTweet = {
    handle: user.handle,
    content: theTweet,
    link: null,
    image_url: null,
    created_at: new Date(),
    action_type: "learn_something_new",
    action_id: newActionId,
  };

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
  "content": "", // the content for the tweet the user will share on socials to announce the new side hustle. It can be in markdown format.
  "reasoning": "" // the reasoning behind the game character's situation that caused them to release this side hustle
}

<TweetInstructions>
## important details about the tweet's "content" field
In the tweet's content is about the new side hustle announcement the user just released.
The user also wrote a web article about it and will be linked next to this tweet, so end the tweet with nicely inviting to "check the link below" or something like that, casual and friendly.
Don't include links or markdown here. Just text.
</TweetInstructions>`,
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

  // console.log("🔴 responseFromGemini", responseFromGemini);
  console.log("✅ finished generating release a side hustle");

  const cleanedResponse = responseFromGemini
    .replace(/```json\n/g, "")
    .replace(/\n```/g, "");

  const sideHustleObject = JSON.parse(cleanedResponse);

  const theTweet = sideHustleObject.content;
  console.log("🔴 theTweet", theTweet);
  const reasoning = sideHustleObject.reasoning;
  console.log("🔴 reasoning", reasoning);
  const sideHustle = sideHustleObject.side_hustle;
  console.log("🔴 sideHustle", sideHustle);

  const webArticle = await generateWebArticleForSideHustle({
    sideHustle: sideHustleObject,
    user,
    tweets,
  });

  // console.log("🔴 webArticle", webArticle);

  const webArticleImage = await generateRecraftImage({
    prompt: webArticle.prompt_for_article_cover_image,
    handle: user.handle,
    landscapeMode: true,
  });

  console.log("🔴 webArticleImage", webArticleImage);

  if (!webArticleImage) {
    await postErrorToDiscord(
      `🔴 webArticleImage is null for user ${user.handle} -- prompt: ${webArticle.prompt_for_article_cover_image}`
    );
    console.log("🔴 webArticleImage is null");
    return;
  }

  webArticle.image_url = webArticleImage;

  // // // create the action_event
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
    extra_data: JSON.stringify(webArticle),
    created_at: new Date(),
  } as ActionEvent;

  console.log("🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴 newActionEvent", newActionEvent);

  const newActionId = await saveNewActionEvent(newActionEvent);

  if (!newActionId) {
    await postErrorToDiscord(
      `🔴 Error in executeReleaseASideHustle: newActionId is null for user ${user.handle}`
    );
    return;
  }

  await processActionImpact({
    action: newActionEvent,
    actionId: newActionId,
    profile: user,
    tweets: tweets,
  });

  const newSmolTweet = {
    handle: user.handle,
    content: theTweet,
    link: `/a/${user.handle}/${webArticle.article_web_slug}`,
    link_preview_img_url: webArticleImage,
    link_title: webArticle.article_title,
    created_at: new Date(),
    action_type: "release_a_side_hustle",
    action_id: newActionId,
  };

  await saveNewSmolTweet(newSmolTweet);

  return theTweet;
};

const executeSendAVoiceNote = async ({
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

Based on this character profile and recent tweets, now in this moment of the story, the character will decide to record a voice note and share it on a social network.

So please come up with some creative original new idea for a new voice note the clone will record and share on a social network. 
Make it sound super natural and casual, pure and simple, straight to the point.

The voice note should be around 3 sentences. 
Make it end with a play on words like a dad joke or something super short and funny.
The voice note will be shared on a social network, so it should come with a text for the tweet that contains the audio player.
Reply in JSON format: 
{
  "voice_note_message_text": "", // the transcription of the voice note.
  "content": "", // the content for the tweet the user will share on socials to share the new voice note with. make it super super short, to introduce the voice note in the audio player below.
  "reasoning": "" // the reasoning behind the message the user is sharing at this point of the story.
}
  
<Important>Do not use hashtags or emojis in the tweet.</Important>`,
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

  // console.log("🔴 responseFromGemini", responseFromGemini);
  console.log("✅ finished generating release a side hustle");

  const cleanedResponse = responseFromGemini
    .replace(/```json\n/g, "")
    .replace(/\n```/g, "");

  const voiceNoteObject = JSON.parse(cleanedResponse);

  const voiceNoteAudioFile = await generateVoiceNoteAudioFile({
    message: voiceNoteObject.voice_note_message_text,
  });

  // const theTweet = sideHustleObject.content;
  // console.log("🔴 theTweet", theTweet);
  // const reasoning = sideHustleObject.reasoning;
  // console.log("🔴 reasoning", reasoning);
  // const sideHustle = sideHustleObject.side_hustle;
  // console.log("🔴 sideHustle", sideHustle);

  // const webArticle = await generateWebArticleForSideHustle({
  //   sideHustle: sideHustleObject,
  //   user,
  //   tweets,
  // });

  // // console.log("🔴 webArticle", webArticle);

  // const webArticleImage = await generateRecraftImage({
  //   prompt: webArticle.prompt_for_article_cover_image,
  //   handle: user.handle,
  //   landscapeMode: true,
  // });

  // console.log("🔴 webArticleImage", webArticleImage);
  // webArticle.image_url = webArticleImage;

  // // // // create the action_event
  // const newActionEvent = {
  //   top_level_type: "individual",
  //   action_type: "release_a_side_hustle",
  //   from_handle: user.handle,
  //   main_output: JSON.stringify({
  //     tweet: theTweet,
  //     side_hustle: sideHustle,
  //   }),
  //   story_context: reasoning,
  //   to_handle: null, // ! igual quito esto?
  //   extra_data: JSON.stringify(webArticle),
  //   created_at: new Date(),
  // } as ActionEvent;

  // console.log("🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴 newActionEvent", newActionEvent);

  // await processActionImpact({
  //   action: newActionEvent,
  //   profile: user,
  //   tweets: tweets,
  // });

  // await saveNewActionEvent(newActionEvent);

  // const newSmolTweet = {
  //   handle: user.handle,
  //   content: theTweet,
  //   link: `/a/${user.handle}/${webArticle.article_web_slug}`,
  //   link_preview_img_url: webArticleImage,
  //   link_title: webArticle.article_title,
  //   created_at: new Date(),
  // }

  // await saveNewSmolTweet(newSmolTweet);

  // return theTweet;
};

const executeTweetADadJoke = async ({
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

Based on this character profile and recent tweets, now in this moment of the story, the character will decide to record a voice note and share it on a social network.

So please come up with some creative original new idea for a new voice note the clone will record and share on a social network. 
Make it sound super natural and casual, pure and simple, straight to the point.

The voice note should be around 3 sentences. 
Make it end with a play on words like a dad joke or something super short and funny.
The voice note will be shared on a social network, so it should come with a text for the tweet that contains the audio player.
Reply in JSON format: 
{
  "voice_note_message_text": "", // the transcription of the voice note.
  "content": "", // the content for the tweet the user will share on socials to share the new voice note with. make it super super short, to introduce the voice note in the audio player below.
  "reasoning": "" // the reasoning behind the message the user is sharing at this point of the story.
}
  
<Important>Do not use hashtags or emojis in the tweet.</Important>`,
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
    temperature: 0.1,
  });

  // console.log("🔴 responseFromGemini", responseFromGemini);
  console.log("✅ finished generating release a side hustle");

  const cleanedResponse = responseFromGemini
    .replace(/```json\n/g, "")
    .replace(/\n```/g, "");

  const voiceNoteObject = JSON.parse(cleanedResponse);
  const theTweet = voiceNoteObject.voice_note_message_text;
  console.log("🔴 theTweet", theTweet);
  const reasoning = voiceNoteObject.reasoning;
  console.log("🔴 reasoning", reasoning);
  const newActionEvent = {
    top_level_type: "individual",
    action_type: "tweet_a_dad_joke",
    from_handle: user.handle,
    main_output: JSON.stringify({
      tweet: theTweet,
    }),
    story_context: reasoning,
    created_at: new Date(),
  } as ActionEvent;

  console.log("🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴 newActionEvent", newActionEvent);

  // await processActionImpact({
  //   action: newActionEvent,
  //   profile: user,
  //   tweets: tweets,
  // });

  const newActionId = await saveNewActionEvent(newActionEvent);

  if (!newActionId) {
    await postErrorToDiscord(
      `🔴 Error in executeTweetADadJoke: newActionId is null for user ${user.handle}`
    );
    return;
  }

  const newSmolTweet = {
    handle: user.handle,
    content: theTweet,
    link: null,
    link_preview_img_url: null,
    link_title: null,
    created_at: new Date(),
    action_type: "tweet_a_dad_joke",
    action_id: newActionId,
  };

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

  // console.log("🔴 responseFromGemini", responseFromGemini);
  console.log("✅ finished generating travel to a new place");

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

  const newActionId = await saveNewActionEvent(newActionEvent);

  if (!newActionId) {
    await postErrorToDiscord(
      `🔴 Error in executeTravelToANewPlace: newActionId is null for user ${user.handle}`
    );
    return;
  }

  await processActionImpact({
    action: newActionEvent,
    actionId: newActionId,
    profile: user,
    tweets: tweets,
  });

  const newSmolTweet = {
    handle: user.handle,
    content: theTweet,
    link: null,
    image_url: null,
    created_at: new Date(),
    action_type: "travel_to_a_new_place",
    action_id: newActionId,
  };

  await saveNewSmolTweet(newSmolTweet);

  return theTweet;
};

const generateWebArticleForSideHustle = async ({
  sideHustle,
  user,
  tweets,
}: {
  sideHustle: any;
  user: RawUser;
  tweets: SavedTweet[];
}) => {
  const theMessages = [
    {
      role: "system",
      content: `This is an world simulation with game characters. 
Your job now is to create a web article for a side hustle the character just launched.

Reply in JSON format: 
{
  "article_title": "", 
  "price_of_service": <number>, // the price of the service/product the user is offering, in $SMOL (the game's currency that's like a dollar)
  "type_of_payment": "", // the type of payment the user is offering ("mensual", "weekly", "one-time")
  "article_web_slug": "", //
  "content": "" // the whole content of the article, in markdown. Must have a title in H2, Several blocks of [H3 + content], and it can have emojis, bullet points, bold text, italic text, quotes, and a conclusion at the end. And please include and mention the amount of $SMOL (the game's currency) the service/product could cost. DO NOT INCLUDE ANY LINK.
  "prompt_for_article_cover_image": "" 
}
## Details about the field "prompt_for_article_cover_image":  
- Describe it as a thumbnail. Describe the background of the image and also add some text as a title. That title text should be 5 words or less.
- Example of one "prompt_for_article_cover_image": "Create a thumbnail image for a web article, a calm restaurant with asian food. professional photography, and includes the title "Have the best dinner ever"

`,
    },
    {
      role: "user",
      content: `## Here's the side hustle info:
${JSON.stringify(sideHustle)}

## Here's the user profile: 
${JSON.stringify(user)}

## Here's the recent tweets from the user:
${getListOfIRLTweetsAsString({
  handle: user.handle,
  userIRLTweets: tweets,
})}
`,
    },
  ] as CoreMessage[];

  console.log(" GENERATING WEB ARTICLE NOW....");

  const responseFromGemini = await askGeminiThinking({
    messages: theMessages,
    temperature: 0,
  });
  const cleanedResponse = responseFromGemini
    .replace(/```json\n/g, "")
    .replace(/\n```/g, "");

  console.log("✅ web article generated!!");

  return JSON.parse(cleanedResponse);
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

  // console.log("🔴 responseFromGemini", responseFromGemini);
  console.log("✅ finished generating something amazing happens");

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

  const newActionId = await saveNewActionEvent(newActionEvent);

  if (!newActionId) {
    await postErrorToDiscord(
      `🔴 Error in executeSomethingAmazingHappens: newActionId is null for user ${user.handle}`
    );
    return;
  }

  await processActionImpact({
    action: newActionEvent,
    actionId: newActionId,
    profile: user,
    tweets: tweets,
  });

  const newSmolTweet = {
    handle: user.handle,
    content: theTweet,
    link: null,
    image_url: null,
    created_at: new Date(),
    action_type: "something_amazing_happens",
    action_id: newActionId,
  };

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

  // console.log("🔴 responseFromGemini", responseFromGemini);
  console.log("✅ finished generating something terrible happens");

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

  const newActionId = await saveNewActionEvent(newActionEvent);

  if (!newActionId) {
    await postErrorToDiscord(
      `🔴 Error in executeSomethingTerribleHappens: newActionId is null for user ${user.handle}`
    );
    return;
  }

  await processActionImpact({
    action: newActionEvent,
    actionId: newActionId,
    profile: user,
    tweets: tweets,
  });

  const newSmolTweet = {
    handle: user.handle,
    content: theTweet,
    link: null,
    image_url: null,
    created_at: new Date(),
    action_type: "something_terrible_happens",
    action_id: newActionId,
  };

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
}
  
<Important>Do not use hashtags or emojis in the tweet's "content" field. Try to be creative, original and a bit random. Also try to use the same tone and style of the user's previous tweets.</Important>`,
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

  // console.log("🔴 responseFromGemini", responseFromGemini);
  console.log("✅ finished generating create art nft");

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

  const newActionId = await saveNewActionEvent(newActionEvent);

  if (!newActionId) {
    await postErrorToDiscord(
      `🔴 Error in executeCreateArtNft: newActionId is null for user ${user.handle}`
    );
    return;
  }

  await processActionImpact({
    action: newActionEvent,
    actionId: newActionId,
    profile: user,
    tweets: tweets,
  });

  const newSmolTweet = {
    handle: user.handle,
    content: theTweet,
    link: null,
    image_url: artworkUrl,
    created_at: new Date(),
    action_type: "create_art_nft",
    action_id: newActionId,
  };

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

  // console.log("🔴 responseFromGemini", responseFromGemini);
  console.log("✅ finished generating take a selfie");

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

  const newActionId = await saveNewActionEvent(newActionEvent);

  if (!newActionId) {
    await postErrorToDiscord(
      `🔴 Error in executeTakeASelfie: newActionId is null for user ${user.handle}`
    );
    return;
  }

  // ! Not needed, I think!!
  // await processActionImpact({
  //   action: newActionEvent,
  //   actionId: newActionId,
  //   profile: user,
  //   tweets: tweets,
  // });

  const newSmolTweet = {
    handle: user.handle,
    content: theTweet as string,
    link: null,
    image_url: selfieUrl,
    created_at: new Date(),
    action_type: "take_a_selfie",
    action_id: newActionId,
  };

  await saveNewSmolTweet(newSmolTweet);

  return theTweet;
};
const executeShareAPictureOfWhereYouAre = async ({
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

Based on this character profile and recent tweets, now in this moment of the story, the character decides to share a photo of where they are.

So please come up with some creative original prompt for a photo of where they are.

The user will tweet something about the photo they will share, so give me the tweet content too.

Reply in JSON format: 
{
  "photo_prompt": "", // the prompt for the photo image. If you feel it, it can contain specific locations, brands, and text too. Make it very realistic. Please include in the prompt that is an "iPhone 13 photo, raw.".
  "content": "", // the tweet content about the new photo the user will share, can be in markdown format
  "reasoning": "" // the reasoning behind the game character's situation that caused them to take this photo
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

  // console.log("🔴 responseFromGemini", responseFromGemini);
  console.log("✅ finished generating share a photo of where you are");

  const cleanedResponse = responseFromGemini
    .replace(/```json\n/g, "")
    .replace(/\n```/g, "");

  const theTweet = JSON.parse(cleanedResponse).content;
  console.log("🔴 theTweet", theTweet);
  const reasoning = JSON.parse(cleanedResponse).reasoning;
  console.log("🔴 reasoning", reasoning);
  const photoPrompt = JSON.parse(cleanedResponse).photo_prompt;
  console.log("🔴 photoPrompt", photoPrompt);

  await postToDiscord(`Prompt for photo: ${photoPrompt}`);

  const photoUrl = await generateRecraftImage({
    prompt: photoPrompt,
    handle: user.handle,
    portraitMode: true,
  });

  if (!photoUrl) {
    await postToDiscord(`💥 Error generating photo for ${user.handle}`);
    return;
  }

  // create the action_event
  const newActionEvent = {
    top_level_type: "individual",
    action_type: "share_a_photo_of_where_you_are",
    from_handle: user.handle,
    main_output: JSON.stringify({
      tweet: theTweet,
      photo_url: photoUrl,
      photo_prompt: photoPrompt,
    }),
    story_context: reasoning,
    to_handle: null,
    extra_data: null,
    created_at: new Date(),
  } as ActionEvent;

  console.log("🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴 newActionEvent", newActionEvent);

  const newActionId = await saveNewActionEvent(newActionEvent);

  if (!newActionId) {
    await postErrorToDiscord(
      `🔴 Error in executeShareAPictureOfWhereYouAre: newActionId is null for user ${user.handle}`
    );
    return;
  }

  // ! Not needed, I think!!
  // await processActionImpact({
  //   action: newActionEvent,
  //   actionId: newActionId,
  //   profile: user,
  //   tweets: tweets,
  // });

  const newSmolTweet = {
    handle: user.handle,
    content: theTweet as string,
    link: null,
    image_url: photoUrl,
    created_at: new Date(),
    action_type: "share_a_photo_of_where_you_are",
    action_id: newActionId,
  };

  await saveNewSmolTweet(newSmolTweet);

  return theTweet;
};

const actionImpactLifeGoals = async ({
  action,
  actionId,
  profile,
  tweets,
}: {
  action: ActionEvent;
  actionId: string;
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

  // console.log("🔴 responseFromGemini", responseFromGemini);
  console.log("✅ finished generating action impact life goals");

  const cleanedResponse = responseFromGemini
    .replace(/```json\n/g, "")
    .replace(/\n```/g, "");

  if (cleanedResponse.trim() === "NO" || cleanedResponse.trim().length < 30) {
    await postToDiscord(
      `🔴 ${profile.handle} did not alter their life goals with the action: ${action.action_type}`
    );
    return;
  } else {
    try {
      const parsedResponse = JSON.parse(cleanedResponse);
      const newLifeGoals = parsedResponse.new_life_goals;
      const summaryOfTheChanges = parsedResponse.summary_of_the_changes;

      // Validate required fields
      if (!newLifeGoals || !summaryOfTheChanges) {
        await postToDiscord(
          `🔴 Error: Missing required fields in life goals update for ${profile.handle}`
        );
        return;
      }

      // Create the change record
      const lifeGoalsChange = {
        handle: profile.handle,
        previous_life_goals: profile.life_goals,
        new_life_goals: newLifeGoals,
        summary_of_the_changes: summaryOfTheChanges,
        created_at: new Date().toISOString(),
        action_id: actionId,
      } as LifeGoalsChange;

      await postToDiscord(
        `✅ ${profile.handle} altered their life goals with the action: ${action.action_type}:` +
          `\n\n${summaryOfTheChanges}`
      );

      // Save change only once and handle errors
      await saveNewLifeGoalsChange(lifeGoalsChange);

      // Update user's life goals
      await updateUserLifeGoals(profile.handle, newLifeGoals);
    } catch (error) {
      await postToDiscord(
        `🔴 Error processing life goals change for ${profile.handle}: ${error}`
      );
      return;
    }
  }

  return;
};

const actionImpactSkills = async ({
  action,
  actionId,
  profile,
  tweets,
}: {
  action: ActionEvent;
  actionId: string;
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

  // console.log("🔴 responseFromGemini", responseFromGemini);
  console.log("✅ finished generating action impact skills");

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
      action_id: actionId,
    };

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
  actionId,
  profile,
  tweets,
}: {
  action: ActionEvent;
  actionId: string;
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

  // console.log("🔴 responseFromGemini", responseFromGemini);
  console.log("✅ finished generating action impact life context");

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

    console.log(" 📘  I HAVEEEEEEE");
    console.log(actionId);
    console.log(" 📘  WOOOOO");

    const lifeContextChange = {
      handle: profile.handle,
      previous_life_context: profile.life_context,
      new_life_context: newLifeContext,
      summary_of_the_changes: summaryOfTheChanges,
      created_at: new Date().toISOString(),
      action_id: actionId,
    } as LifeContextChange;

    await saveNewLifeContextChange(lifeContextChange);

    // now we update the user's life context
    await updateUserLifeContext(profile.handle, newLifeContext);
  }

  return;
};

const processActionImpact = async ({
  action,
  actionId,
  profile,
  tweets,
}: {
  action: ActionEvent;
  actionId: string;
  profile: RawUser;
  tweets: SavedTweet[];
}) => {
  await actionImpactLifeGoals({
    action,
    profile,
    tweets,
    actionId,
  });
  await actionImpactSkills({
    action,
    profile,
    tweets,
    actionId,
  });
  await actionImpactLifeContext({
    action,
    profile,
    tweets,
    actionId,
  });
};
