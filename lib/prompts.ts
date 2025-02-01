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

Reply directly with the list of life goals in Markdown format.
With ${LIFE_GOALS_DEFAULT_COUNT} total goals is enough. Thanks.`;

  const messages: ChatMessage[] = [
    {
      role: "user",
      content: userPrompt,
    },
  ];

  const response = await askGeminiWithMessagesAndSystemPrompt({
    messages,
    systemPrompt:
      "You are the incredible AI for 'Smol Universe', a simulation proyect with the user's personality. You are given a list of life goals for the user. Please return a list of life goals for the user in Markdown format.",
  });

  return response;
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
