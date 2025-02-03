import { postErrorToDiscord } from "./discord";

export const generateGliffWojakMeme = async (prompt: string) => {
  try {
    const keys = [process.env.GLIFF_API_KEY_1!, process.env.GLIFF_API_KEY_2!];
    const GLIFF_API_KEY = keys[Math.floor(Math.random() * keys.length)];

    const data = {
      // id: "clgh1vxtu0011mo081dplq3xs", // bot with text generator or something (from the API docs examples)
      // id: "clxuklosr000g9ma64pu22xxx", // Pepe Generator
      // id: "cm3o7dfsd002610z48sz89yih", // Slap Logo on Anything
      id: "clxtc53mi0000ghv10g6irjqj", // ! WOJAK MEME GENERATOR
      inputs: [prompt],
    };
    console.log("✅ calling gliff now...");

    const response = await fetch("https://simple-api.glif.app", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GLIFF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();

    console.log("✅ GLIFF GENERATED!!!!");
    console.log(result);

    const gliffImage = result.output;
    return gliffImage;
  } catch (error) {
    await postErrorToDiscord(
      "❌ GLIFF GENERATION FAILED for prompt: " + prompt
    );
    console.error("❌ GLIFF ERROR", error);
    throw error;
  }
};
