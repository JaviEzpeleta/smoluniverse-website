import { LIFE_GOALS_DEFAULT_COUNT } from "./constants";
import { askGeminiWithMessagesAndSystemPrompt } from "./gemini";
import { getIRLTweets } from "./postgres";
import { ChatMessage, SavedTweet } from "./types";

export const getLifeGoals = async (handle: string) => {
  const userIRLTweets = await getIRLTweets({ handle });

  const userPrompt = `List of tweets from ${handle}:
${getListOfIRLTweetsAsString({ handle, userIRLTweets })}

Please Return a list of life goals in Markdown format, using bullet points that can begin with an emoji if you feel it.

Something like ${LIFE_GOALS_DEFAULT_COUNT} total goals is enough.

Reply directly with the list of life goals in Markdown format, and nothing else.`;

  const messages: ChatMessage[] = [
    {
      role: "user",
      content: userPrompt,
    },
  ];

  const response = await askGeminiWithMessagesAndSystemPrompt({
    messages,
    systemPrompt: `You are the brain behind 'Smol Universe', an art and storytelling simulation experiment project.
Based on the tweets from this user (${handle}), help me create a fictional character for a videogame story. 
Please give me a list of life goals this character could have in the videogame, that are somehow related to the tweets, but make it as "gamificationable" as possible. 
Ideally the goals are concise, practical, achievable and fun. 

Please return a list of life goals for the user in Markdown format. Reply ONLY and directly with the list of life goals in Markdown format.`,
    temperature: 0.9,
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
