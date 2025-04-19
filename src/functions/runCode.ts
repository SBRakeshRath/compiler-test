import fs from "fs";
import { exec, spawnSync } from "child_process";
import CreateFile from "./createFile.js";
import { config } from "dotenv";
import path from "path";
config();

const bufferSize = Number(process.env.MAX_BUFFER_SIZE) * 1024 * 1024;
const timeout = Number(process.env.MAX_RUN_TIME) * 1000;
// const filepath = path.resolve("./test.js");

export default async function RunCode(filepath:string) {
  // filepath2: string
  if (!fs.existsSync(filepath)) {
    console.log("File not found: ", filepath);
    return false;
  }

  const outPutFile = CreateFile(".out");
  const command = `delirium ${filepath}`;

  try {
    const { stdout, stderr, error } = spawnSync(command, {
      shell: true,
      timeout: timeout,
      maxBuffer: bufferSize,
    });
    //write everything to output file

    fs.writeFileSync(outPutFile, String(stdout), { flag: "w" });

    let status = "success";

    if (error) {
      status = "error";
      fs.writeFileSync(outPutFile, String(error), { flag: "a" });
    }
    if (stderr.toString().trim() !== "") {
      status = "error";
      fs.writeFileSync(outPutFile, String(stderr), { flag: "a" });
    }

    return {
      status: status,
      file: outPutFile,
    };
  } catch (error) {
    console.log("Error in executing command: ", error);
    return false;
  }
}
