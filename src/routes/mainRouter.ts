import { Router } from "express";
import z from "zod";
import fetchCode from "../functions/fetchCode.js";
import RunCode from "../functions/runCode.js";
import UploadFile from "../storage/uploadFile.js";
import { updateStatus } from "../db/getData.js";

const mainRouter = Router();

mainRouter.post("/", async (req, res) => {
  const body = req.body;
  const schema = z.object({
    docID: z.string().min(6),
  });
  const result = schema.safeParse(body);
  if (!result.success) {
    res.status(400).json({
      error: "docID is required",
    });
    return;
  }
  const { docID } = result.data;

  try {
    const filePath = await fetchCode(docID);
    if (!filePath) {
      throw new Error("File not found");
    }
    const runCodeResponse = await RunCode(filePath);
    // const runCodeResponse = await RunCode();

    if (!runCodeResponse) {
      throw new Error("Output file not found");
    }
    const uploadFileLink = await UploadFile(runCodeResponse.file);
    if (!uploadFileLink) {
      throw new Error("Upload file link not found");
    }
    console.log("Upload file link: ", uploadFileLink);
    await updateStatus(docID, runCodeResponse.status, uploadFileLink);
    res.json({
      message: "SUCCESS",
    });
    return;
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Internal Server Error",
    });

    return;
  }
});

export default mainRouter;
