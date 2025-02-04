import Replicate from "replicate";

import { uploadWebpFromURLToAWSS3 } from "./aws";
import { postToDiscord } from "./discord";

export const generateRecraftImage = async ({
  prompt,
  handle,
  portraitMode = false,
  landscapeMode = false,
}: {
  prompt: string;
  handle: string;
  portraitMode?: boolean;
  landscapeMode?: boolean;
}) => {
  const replicate = new Replicate();

  const modelToUse = "recraft-ai/recraft-v3";
  const input = {
    size: portraitMode
      ? "1024x1365"
      : landscapeMode
      ? "1820x1024"
      : "1024x1024",
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
