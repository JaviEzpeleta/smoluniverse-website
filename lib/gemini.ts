import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { GEMINI_LATEST, GEMINI_THINKING } from "./constants";
import { ChatMessage } from "./types";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { CoreMessage, generateText } from "ai";

export const askGemini = async ({
  prompt,
  modelName = GEMINI_LATEST,
  useCase = "default",
}: {
  prompt: string;
  modelName?: string;
  useCase?: string;
}) => {
  const keys = [
    process.env.GOOGLE_GEMINI_API_KEY_1!,
    process.env.GOOGLE_GEMINI_API_KEY_2!,
    process.env.GOOGLE_GEMINI_API_KEY_3!,
  ];

  const RANDOM_GEMINI_API_KEY = keys[Math.floor(Math.random() * keys.length)];

  const genAI = new GoogleGenerativeAI(RANDOM_GEMINI_API_KEY);

  const model = genAI.getGenerativeModel({ model: modelName });
  console.log(" 🧠  calling Gemini... [" + useCase + "]");

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();
  console.log(" 🧠  done! [" + useCase + "]");
  return responseText;
};

export const askGeminiWithMessagesAndSystemPrompt = async ({
  messages,
  systemPrompt,
  temperature = 0.2,
}: {
  messages: ChatMessage[];
  systemPrompt: string;
  temperature?: number;
}) => {
  const keys = [
    process.env.GOOGLE_GEMINI_API_KEY_1!,
    process.env.GOOGLE_GEMINI_API_KEY_2!,
    process.env.GOOGLE_GEMINI_API_KEY_3!,
  ];

  const RANDOM_GEMINI_API_KEY = keys[Math.floor(Math.random() * keys.length)];

  const genAI = new GoogleGenerativeAI(RANDOM_GEMINI_API_KEY);

  const model = genAI.getGenerativeModel({
    model: GEMINI_LATEST,
    systemInstruction: systemPrompt,
    generationConfig: {
      temperature: temperature, // Set your desired temperature here (e.g., 0.9 for more creativity)
    },
  });

  const lastMessageContent = messages[messages.length - 1].content;
  //   console.log(" 👀  MY LAST MESSAGE IS:", lastMessageContent);

  // edit all previous message so if role is assistant, change it to "model":
  const previousMessages = messages.slice(0, -1).map((message) => {
    if (message.role === "assistant") {
      return {
        role: "model",
        content: message.content,
      };
    }
    return message;
  });

  const chat = model.startChat({
    history: previousMessages as any[],
  });

  const result = await chat.sendMessage(lastMessageContent);
  const responseText = result.response.text();
  return responseText;
};

export const askGeminiThinking = async ({
  messages,
  temperature = 0.8,
  useCase = "default",
}: {
  messages: CoreMessage[];
  temperature?: number;
  useCase?: string;
}) => {
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
    temperature,
    model: google(GEMINI_THINKING, {}),
    messages,
  });

  return text;
};
