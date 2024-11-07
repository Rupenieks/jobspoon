import { Injectable } from '@nestjs/common';

import {
  ResumeBaseSchema,
  ResumeDataSchema,
  TResumeBase,
  TResumeData,
} from '@redundant/common';
import OpenAI from 'openai';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssistantService {
  private openai: OpenAI;
  private resumeParserAssistantId: string =
    process.env.RESUME_PARSER_ASSISTANT_ID ?? '';
  private resumeModifierAssistantId: string =
    process.env.RESUME_MODIFIER_ASSISTANT_ID ?? '';

  constructor(private readonly prismaService: PrismaService) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  private cleanOutput(output: string): string {
    return output
      .replace(/\\n/g, '')
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();
  }

  async parseResume(resumeText: string): Promise<TResumeData> {
    try {
      const output = await this.getAssistantOutput({
        assistantId: this.resumeParserAssistantId,
        userInput: resumeText,
      });

      const cleanedOutput = this.cleanOutput(output);

      const parsedOutput = JSON.parse(cleanedOutput);
      const validatedOutput = ResumeDataSchema.parse(parsedOutput);
      return validatedOutput;
    } catch (err) {
      console.error('Error parsing resume:', err);
      throw new Error('Failed to parse resume');
    }
  }

  async getAssistantModifications({
    resumeId,
    input,
    includeJobDescription,
  }: {
    resumeId: string;
    input: string;
    includeJobDescription: boolean;
  }): Promise<TResumeBase> {
    const resume = await this.prismaService.resume.findUnique({
      where: { id: resumeId },
    });

    if (!resume) {
      throw new Error('Resume not found');
    }

    const parsedResume = ResumeBaseSchema.parse(resume);


    let payload = `Here is the resume I want to modify:
      ${JSON.stringify(parsedResume.data)}.
      
      Here is the user's input:
      ${input}`

    if (includeJobDescription) {
      const application = await this.prismaService.application.findUnique({
        where: { resumeId_matchId: { resumeId: resume.id, matchId: resume.matchId } },
        include: {  match: true },
      });

      if (application?.match) {
        payload += `\n\nHere is the job description: ${application.match.longDescription}`;
      }
    }


    const output = await this.getAssistantOutput({
      assistantId: this.resumeModifierAssistantId,
      userInput: payload,
    });

    const cleanedOutput = this.cleanOutput(output);

    const parsedOutput = JSON.parse(cleanedOutput);

    const validatedOutput = ResumeDataSchema.parse(parsedOutput);
    return {
      ...parsedResume,
      data: validatedOutput,
    };
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
