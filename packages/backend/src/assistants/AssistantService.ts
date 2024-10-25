import OpenAI from "openai";
import { ResumeSchema, TResume } from "@redundant/common";
class AssistantService {
  private openai: OpenAI;
  private resumeParserAssistantId: string =
    process.env.RESUME_PARSER_ASSISTANT_ID ?? "";
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async parseResume(resumeText: string): Promise<TResume> {
    try {
      const output = await this.getAssistantOutput({
        assistantId: this.resumeParserAssistantId,
        userInput: resumeText,
      });

      // Clean the output by removing newlines and JSON code block markers
      const cleanedOutput = output
        .replace(/\\n/g, "")
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      // Parse the cleaned JSON string
      const parsedOutput = JSON.parse(cleanedOutput);
      const validatedOutput = ResumeSchema.parse(parsedOutput);
      return validatedOutput;
    } catch (err) {
      console.error("Error parsing resume:", err);
      throw new Error("Failed to parse resume");
    }
  }

  async getAssistantOutput({
    assistantId,
    userInput,
  }: {
    assistantId: string;
    userInput: string;
  }): Promise<string> {
    try {
      // Create a thread
      const thread = await this.openai.beta.threads.create();

      // Add a message to the thread
      await this.openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: userInput,
      });

      // Run the assistant
      const run = await this.openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistantId,
      });

      // Wait for the run to complete
      let runStatus = await this.openai.beta.threads.runs.retrieve(
        thread.id,
        run.id
      );
      while (runStatus.status !== "completed") {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        runStatus = await this.openai.beta.threads.runs.retrieve(
          thread.id,
          run.id
        );
      }

      // Retrieve the messages
      const messages = await this.openai.beta.threads.messages.list(thread.id);

      // Find the last assistant message
      const lastAssistantMessage = messages.data
        .filter((message) => message.role === "assistant")
        .pop();

      if (
        lastAssistantMessage &&
        lastAssistantMessage.content[0].type === "text"
      ) {
        return lastAssistantMessage.content[0].text.value;
      } else {
        return "No response from assistant.";
      }
    } catch (error) {
      console.error("Error in getAssistantOutput:", error);
      throw new Error("Failed to get assistant output");
    }
  }
}

export default AssistantService;
