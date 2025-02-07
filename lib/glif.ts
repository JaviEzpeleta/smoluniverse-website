import { postErrorToDiscord, postToDiscord } from "./discord";

export const generateGlifWojakMeme = async (prompt: string) => {
  try {
    const keys = [process.env.GLIF_API_KEY_1!, process.env.GLIF_API_KEY_2!];
    const GLIF_API_KEY = keys[Math.floor(Math.random() * keys.length)];

    const data = {
      // id: "clgh1vxtu0011mo081dplq3xs", // bot with text generator or something (from the API docs examples)
      // id: "clxuklosr000g9ma64pu22xxx", // Pepe Generator
      // id: "cm3o7dfsd002610z48sz89yih", // Slap Logo on Anything
      id: "clxtc53mi0000ghv10g6irjqj", // ! WOJAK MEME GENERATOR
      inputs: [prompt],
    };
    console.log("✅ calling glif now...");

    const response = await fetch("https://simple-api.glif.app", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GLIF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();

    console.log("✅ GLIF GENERATED!!!!");
    console.log(result);

    const glifImage = result.output;
    await postToDiscord(
      `✅ GLIF GENERATED!!!\n\n${glifImage}\n\nfor prompt: ${prompt}`
    );
    return glifImage;
  } catch (error) {
    await postErrorToDiscord("❌ GLIF GENERATION FAILED for prompt: " + prompt);
    console.error("❌ GLIF ERROR", error);
    throw error;
  }
};

export const generateGlifPixelArt = async (prompt: string) => {
  try {
    const keys = [process.env.GLIF_API_KEY_1!, process.env.GLIF_API_KEY_2!];
    const GLIF_API_KEY = keys[Math.floor(Math.random() * keys.length)];

    const data = {
      id: "cm6nkx2sj0008fbkpxpuw9sv5", // ! PIXEL ART GENERATOR
      inputs: [prompt],
    };
    console.log("✅ calling glif now...");

    const response = await fetch("https://simple-api.glif.app", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GLIF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();

    console.log("✅ GLIF GENERATED!!!!");
    console.log(result);

    const glifImage = result.output;
    await postToDiscord(
      `✅ GLIF GENERATED!!!\n\n${glifImage}\n\nfor prompt: ${prompt}`
    );
    return glifImage;
  } catch (error) {
    await postErrorToDiscord("❌ GLIF GENERATION FAILED for prompt: " + prompt);
    console.error("❌ GLIF ERROR", error);
    throw error;
  }
};
