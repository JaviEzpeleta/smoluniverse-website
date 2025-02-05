import Replicate from "replicate";

import { uploadAudioToAWSS3, uploadWebpFromURLToAWSS3 } from "./aws";
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

export const generateVoiceNoteAudioFile = async ({
  message,
}: {
  message: string;
}) => {
  console.log(" CALLING TTS!!! 🔥");

  const replicate = new Replicate();
  const modelToUse =
    "nyxynyx/f5-tts:e0e48acce40cb39931ed5f1b04e21492bdcf2eb0a0f96842a5e537531e86389b";

  const input = {
    gen_text: message,
    ref_text:
      "when the chapter ends, you can choose what happens next. you can write whatever you want.",
    ref_audio: "https://myclonejackson.com/sounds/giovanni.mp3",
    remove_silence: true,
    custom_split_words: "",
  };

  const stream = (await replicate.run(modelToUse, { input })) as ReadableStream;

  // Convertir el stream a un array buffer
  const reader = stream.getReader();
  const chunks = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  // Combinar los chunks en un solo Uint8Array
  const concatenated = new Uint8Array(
    chunks.reduce((acc, chunk) => acc + chunk.length, 0)
  );
  let position = 0;

  for (const chunk of chunks) {
    concatenated.set(chunk, position);
    position += chunk.length;
  }

  // Ahora tienes los datos en concatenated que puedes usar para subir a AWS
  // Puedes convertirlo a Buffer si tu función de AWS lo requiere
  const buffer = Buffer.from(concatenated);

  // Aquí puedes llamar a tu función de upload a AWS
  const uploadedUrl = await uploadAudioToAWSS3(buffer);
  // return uploadedUrl;

  return uploadedUrl;
};
