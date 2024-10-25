import OpenAI from "openai";

class AssistantService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
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
