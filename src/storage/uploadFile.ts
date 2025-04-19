import { Storage } from "@google-cloud/storage";
import { config } from "dotenv";
config();

const bucketName = process.env.BUCKET_NAME;

export default async function UploadFile(filePath: string) {
  const storage = new Storage();
  const bucket = storage.bucket("delirium-code-compile-stack");
  console.log(filePath)
  try {
    const res = await bucket.upload(filePath);
    const accessLink = res[0].metadata.mediaLink;
    return accessLink;
  } catch (error) {
    console.error("Error uploading file: ", error);
    return false;
  }
}
