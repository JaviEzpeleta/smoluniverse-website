import Replicate from "replicate";

import { uploadWebpFromURLToAWSS3 } from "./aws";
import { postToDiscord } from "./discord";

export const generateRecraftImage = async ({
  prompt,
  handle,
  portraitMode = false,
}: {
  prompt: string;
  handle: string;
  portraitMode?: boolean;
}) => {
  const replicate = new Replicate();

  const modelToUse = "recraft-ai/recraft-v3";
  const input = {
    size: portraitMode ? "1024x1536" : "1365x1024",
    prompt,
  };

  const output = await replicate.run(modelToUse, {
    input,
  });

  if (output) {
    try {
      const uploadedImageUrl = await uploadWebpFromURLToAWSS3(output as any);

      postToDiscord(
        modelToUse +
          " created by " +
          handle +
          ": " +
          uploadedImageUrl +
          " with the prompt: " +
          prompt
      );
      return uploadedImageUrl;
    } catch (error) {
      console.log(" 💥 error uploading image to S3", error);
      return false;
    }
  } else return false;
};
