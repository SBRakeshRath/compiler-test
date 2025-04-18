import { v4 } from "uuid";
import fs from "fs";
import os from "os";
import { GetInputFileLink } from "../db/getData.js";

export default async function fetchCode(id: string) {
  try {
    const scriptLink = await GetInputFileLink(id);
    if (!scriptLink) {
      throw new Error("Failed to fetch script link");
    }
    // save the file in temp storage
    const fileName = v4() + ".del";
    const filePath = os.tmpdir() + "/" + fileName;

    const response = await fetch(scriptLink);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch: ${response.status} ${response.statusText}`
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(filePath, buffer);

    return filePath; // Return the file path if successful
  } catch (error) {
    console.log(error);

    return false;
  }
}
