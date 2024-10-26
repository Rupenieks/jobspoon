import { Injectable } from '@nestjs/common';
import { TResume, ResumeSchema } from '@redundant/common';
import OpenAI from 'openai';

@Injectable()
export class AssistantService {
  private openai: OpenAI;
  private resumeParserAssistantId: string =
    process.env.RESUME_PARSER_ASSISTANT_ID ?? '';

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

      const cleanedOutput = output
        .replace(/\\n/g, '')
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      const parsedOutput = JSON.parse(cleanedOutput);
      const validatedOutput = ResumeSchema.parse(parsedOutput);
      return validatedOutput;
    } catch (err) {
      console.error('Error parsing resume:', err);
      throw new Error('Failed to parse resume');
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
      const thread = await this.openai.beta.threads.create();

      await this.openai.beta.threads.messages.create(thread.id, {
        role: 'user',
        content: userInput,
      });

      const run = await this.openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistantId,
      });

      let runStatus = await this.openai.beta.threads.runs.retrieve(
        thread.id,
        run.id,
      );
      while (runStatus.status !== 'completed') {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        runStatus = await this.openai.beta.threads.runs.retrieve(
          thread.id,
          run.id,
        );
      }

      const messages = await this.openai.beta.threads.messages.list(thread.id);

      const lastAssistantMessage = messages.data
        .filter((message) => message.role === 'assistant')
        .pop();

      if (
        lastAssistantMessage &&
        lastAssistantMessage.content[0].type === 'text'
      ) {
        return lastAssistantMessage.content[0].text.value;
      } else {
        return 'No response from assistant.';
      }
    } catch (error) {
      console.error('Error in getAssistantOutput:', error);
      throw new Error('Failed to get assistant output');
    }
  }
}
