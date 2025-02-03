import { LIFE_GOALS_DEFAULT_COUNT } from "./constants";
import { askGeminiWithMessagesAndSystemPrompt } from "./gemini";
import { readIRLTweets } from "./postgres";
import { ChatMessage, FetchedTwitterUser, SavedTweet } from "./types";

export const getLifeGoals = async (handle: string) => {
  const userIRLTweets = await readIRLTweets({ handle });

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
    systemPrompt: `You are an storyteller, expert in game character creation.

Based on the tweets from this user (${handle}), help me create a fictional character for a videogame story. 

Please give me a list of life goals this character could have in the videogame, that are somehow related to the tweets, but make it as "gamificationable" as possible. 

Ideally the goals are concise, practical, achievable and fun. 

Please return a list of life goals for the user in Markdown format. Reply ONLY and directly with the list of life goals in Markdown format.`,
    temperature: 0.6,
  });

  return response;
};

export const generateUserInitialSkillLevels = async (handle: string) => {
  const userIRLTweets = await readIRLTweets({ handle });

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
    temperature: 0.7,
  });

  const cleanedResponse = response
    .replace(/```json\n/g, "")
    .replace(/\n```/g, "");

  const parsedResponse = JSON.parse(cleanedResponse);
  return parsedResponse.skills;
};

export const generateUserInitialLifeAdditionalContext = async (
  handle: string,
  profile: FetchedTwitterUser
) => {
  console.log("📙 📙 📙 📙  DEBUG: the bio is: ", profile.description);

  const userIRLTweets = await readIRLTweets({ handle });

  const userPrompt = `# Context on the user @${handle} (name: ${profile.name}):

## Bio on their twitter profile:

${profile.description}
${profile.location}

## List of tweets from the user:
  ${getListOfIRLTweetsAsString({ handle, userIRLTweets })}
  
Analyze these tweets and generate a fictional life context for a parody character. Invent any missing details in a way that makes sense for the character.


Return JSON format:
{
"one_liner": "", A short description of the character's life. Like a "Bio". ((Current user's bio is: ${
    profile.description
  }. Feel free to adapt it. DO NOT include URLs, just names.)) Max 12 words.
"relationship_status_code": "", // "single", "married", "married_with_kids"... or other states you feel like it's appropiated
"location": "" // "Name of the city + an emoji with the country flag."
"current_job_title": "", // Can be a full job title + company name. Examples: "💻  Web developer for OpenAI", "🚀 CTO of Gumroad", "🎨 Illustrator for Marvel Comics", "🏗️ Freelancer", or "🫠 Unemployed" if the character doesn't have a job at the moment.
"weekly_jobs_income": 0, // Fictional salary or sum of all incom sources... maybe between 0-5000 $SMOL (unemployed=0)
"weekly_jobs_income_explained": "" // Reasoning that explanis the background for the weekly_jobs_income value
"weekly_life_expenses": 0 // ...maybe between 200-1000 $SMOL (fictional sum of paying rent and lifestyle personal avg expenses)
"weekly_life_expenses_explained": "" // Reasoning that explanis the background for the weekly_jobs_income value
}

Rules:
- If info isn't in tweets, make up something that would make sense for the character

Return ONLY valid JSON. No explanations.`;

  const messages: ChatMessage[] = [
    {
      role: "user",
      content: userPrompt,
    },
  ];

  const response = await askGeminiWithMessagesAndSystemPrompt({
    messages,
    systemPrompt: `You're the core of "SmolUniverse", an artistic and experimental universe where ai agents live, create and interact in a virtual universe. 
    
Please, based on the tweets from the user, create a fictional life context for a parody character. Invent any missing details in the most entertaining way possible!`,
    temperature: 0.75, // Higher temp for more chaos
  });

  const cleanedResponse = response
    .replace(/```json\n?/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleanedResponse);
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
