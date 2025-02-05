import axios from "axios";
import sharp from "sharp";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { postToDiscord } from "./discord";

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID
      ? process.env.AWS_S3_ACCESS_KEY_ID
      : "",
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
      ? process.env.AWS_S3_SECRET_ACCESS_KEY
      : "",
  },
  region: process.env.AWS_S3_BUCKET_REGION
    ? process.env.AWS_S3_BUCKET_REGION
    : "",
});

export const uploadWebpFromURLToAWSS3 = async (imageUrl: string) => {
  console.log(" 💥 💥 💥 💥 💥 💥 uploading webp to S3;;;;;;; " + imageUrl);

  const newFileImage =
    "webps/" +
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15) +
    ".webp";

  const res = await axios.get(imageUrl, {
    responseType: "arraybuffer",
  });

  const buffer = Buffer.from(res.data, "binary");

  // Compress the image using sharp
  const compressedBuffer = await sharp(buffer)
    .resize({ height: 740 })
    .toFormat("webp")
    .webp({ quality: 80 }) // Adjust quality as needed
    .toBuffer();

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME || "",
    Key: newFileImage,
    Body: compressedBuffer,
    ContentType: "image/webp",
  };
  await s3.send(new PutObjectCommand(params));
  return `https://${params.Bucket}.s3.${process.env.AWS_S3_BUCKET_REGION}.amazonaws.com/${params.Key}`;
};

export const uploadAudioToAWSS3 = async (buffer: Buffer) => {
  const newFileAudio =
    "audios/" +
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15) +
    ".mp3";

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME || "",
    Key: newFileAudio,
    Body: buffer,
  };

  await s3.send(new PutObjectCommand(params));

  const url = `https://${params.Bucket}.s3.${process.env.AWS_S3_BUCKET_REGION}.amazonaws.com/${params.Key}`;
  console.log(" 💥 💥 💥 💥 💥 💥 uploaded audio to S3;;;;;;; " + url);
  await postToDiscord(`💥 💥 💥 💥 💥 💥 uploaded audio to S3;;;;;;; ${url}`);
  return url;
};
