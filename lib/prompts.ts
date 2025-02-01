import { LIFE_GOALS_DEFAULT_COUNT } from "./constants";
import { askGeminiWithMessagesAndSystemPrompt } from "./gemini";
import { getIRLTweets } from "./postgres";
import { ChatMessage, SavedTweet } from "./types";

export const tellMeAJoke = async () => {
  const prompt = `
    Tell me a joke
    `;

  const messages: ChatMessage[] = [
    {
      role: "user",
      content: prompt,
    },
  ];

  const response = await askGeminiWithMessagesAndSystemPrompt({
    messages,
    systemPrompt: "You are a joke teller",
  });

  return response;
};

export const getLifeGoals = async (handle: string) => {
  const userIRLTweets = await getIRLTweets({ handle });

  const userPrompt =
    "Based on the following tweets, please generate a list of life goals for the user: " +
    handle +
    "\n\n" +
    getListOfIRLTweetsAsString({ handle, userIRLTweets }) +
    "\n\n" +
    `Please Return a in Markdown, using bullet lists and sublists. 
Try to cover all the aspects of the user's professional and personal life.
The goal is to create a clone with the user's personality for entertainment and storytelling purposes.

With ${LIFE_GOALS_DEFAULT_COUNT} total goals is enough.
Reply directly with the list of life goals in Markdown format, and nothing else.`;

  const messages: ChatMessage[] = [
    {
      role: "user",
      content: userPrompt,
    },
  ];

  const response = await askGeminiWithMessagesAndSystemPrompt({
    messages,
    systemPrompt:
      "You are the incredible AI for 'Smol Universe', a simulation proyect with the user's personality. You are given a list of life goals for the user. Please return a list of life goals for the user in Markdown format. Reply ONLY and directly with the list of life goals in Markdown format.",
  });

  return response;
};

export const generateUserInitialSkillLevels = async (handle: string) => {
  const userIRLTweets = await getIRLTweets({ handle });

  const userPrompt =
    "Let's create a DnD-like character based on the tweets from the user: " +
    handle +
    "\n\n" +
    getListOfIRLTweetsAsString({ handle, userIRLTweets }) +
    "\n\n" +
    `Please Return a JSON with the following format:
    {
      "skills": [
            {
                "emoji": "",
                "name": "talent or skill name",
                "level": [from 0 to 100]
            },
            ...
        ]
    }`;

  const messages: ChatMessage[] = [
    {
      role: "user",
      content: userPrompt,
    },
  ];

  //   console.log("CALLING FOR THE SKILL LEVELS!!");

  const response = await askGeminiWithMessagesAndSystemPrompt({
    messages,
    systemPrompt:
      "You are the incredible AI for 'Smol Universe', a simulation proyect with the user's personality. You are given a list of tweets from the user. Please return a list of skills for the user in JSON format.",
  });
  //   console.log("💚 response", response);

  const cleanedResponse = response
    .replace(/```json\n/g, "")
    .replace(/\n```/g, "");

  //   console.log("💚 cleanedResponse", cleanedResponse);
  const parsedResponse = JSON.parse(cleanedResponse);

  //   console.log("💚 parsedResponse", parsedResponse);
  return parsedResponse.skills;
};

export const getListOfIRLTweetsAsString = ({
  handle,
  userIRLTweets,
}: {
  handle: string;
  userIRLTweets: SavedTweet[];
}) => {
  let list = `<PublicationsFrom${handle}>`;

  userIRLTweets.forEach((tweet: SavedTweet) => {
    list += `

<Publication>
Posted at: ${tweet.posted_at}
    <Content>
        ${tweet.content}
    </Content>
</Publication>

`;
  });

  list += `</PublicationsFrom${handle}>`;

  return list;
};
