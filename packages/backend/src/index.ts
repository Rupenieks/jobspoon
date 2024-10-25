import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import multer from "multer";
import pdf from "pdf-parse";

const app = express();
const port = process.env.PORT || 3000;
const upload = multer({ storage: multer.memoryStorage() });

// In-memory storage for processed resumes
const processedResumes: Record<string, string> = {};

app.post(
  "/process-resume",
  upload.single("file"),
  async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }
    try {
      const data = await pdf(req.file.buffer);
      const text = data.text;
      const id = Date.now().toString();
      processedResumes[id] = text;
      res.json({ id, text });
    } catch (error) {
      console.error("Error processing PDF:", error);
      res.status(500).json({ error: "Error processing PDF" });
    }
  }
);

app.get("/resume/:id", (req, res) => {
  const { id } = req.params;
  const text = processedResumes[id];
  if (text) {
    res.json({ text });
  } else {
    res.status(404).json({ error: "Resume not found" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
