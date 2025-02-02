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

  const userPrompt = `List of tweets from ${handle}:
  ${getListOfIRLTweetsAsString({ handle, userIRLTweets })}
  
  Create a DnD-like character with UNIQUE skills based on these tweets. Mix real skills with 3-5 invented ones. Include 2-4 weaknesses (low level skills).
  
  Return JSON format:
  {
    "skills": [
      {
        "emoji": "🎮",
        "name": "Retro Gaming Mastery",
        "level": 75,
        "description": "Skill for classic game challenges"
      },
      ...
    ]
  }
  
  Include these categories:
  - 40% skills related to tweets
  - 30% invented funny/weird skills
  - 20% life management skills
  - 10% random weaknesses
  
  Level ranges:
  - Strengths: 60-100
  - Neutral: 30-70
  - Weaknesses: 0-40
  
  Reply ONLY with valid JSON.`;

  const messages: ChatMessage[] = [
    {
      role: "user",
      content: userPrompt,
    },
  ];

  const response = await askGeminiWithMessagesAndSystemPrompt({
    messages,
    systemPrompt: `You are the core of 'Smol Universe', a game that converts real personalities into RPG stats. Analyze tweets and generate:

1. REAL skills (e.g., "Python Programming", "Photography") with levels matching tweet mentions
2. INVENTED skills (e.g., "Memefuism", "Wi-Fi Detection") based on patterns
3. FUNNY weaknesses (e.g., "Deadly Cooking", "Plant Assassination") with low levels
4. SOCIAL skills (e.g., "Sarcastic Persuasion", "Pet Seduction")

Rules:
- Varied levels (some high, medium, and low)
- Creative emojis for each skill
- Tangible and concise skill names
- 8-12 total skills
- Short, funny descriptions
- Prioritize fun over realism!`,
    temperature: 0, // Más creatividad
  });

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
