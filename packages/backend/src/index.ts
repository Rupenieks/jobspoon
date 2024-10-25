import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import multer from "multer";
import pdf from "pdf-parse";
import AssistantService from "./assistants/AssistantService";
import { TResume } from "@redundant/common";

const app = express();
const port = process.env.PORT || 3000;
const upload = multer({ storage: multer.memoryStorage() });
const assistantService = new AssistantService();

// Function to parse PDF to text
async function parsePdfToText(buffer: Buffer): Promise<string> {
  const data = await pdf(buffer);
  return data.text;
}

app.post(
  "/process-resume",
  upload.single("file"),
  async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }
    try {
      const text = await parsePdfToText(req.file.buffer);
      const parsedResume: TResume = await assistantService.parseResume(text);
      res.json(parsedResume);
    } catch (error) {
      console.error("Error processing resume:", error);
      res.status(500).json({ error: "Error processing resume" });
    }
  }
);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
