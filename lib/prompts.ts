import { askGeminiWithMessagesAndSystemPrompt } from "./gemini";
import { ChatMessage } from "./types";

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
