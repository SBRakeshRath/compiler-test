import fs from "fs";
import os from "os";
import { v4 } from "uuid";

export default function CreateFile(extension: string) {
  const fileName = v4() + extension;
  const filePath = os.tmpdir() + "/" + fileName;

  fs.writeFileSync(filePath, "", { flag: "w" });
  return filePath;
}
