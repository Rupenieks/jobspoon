import { Injectable, Logger } from '@nestjs/common';

import {
  InsightBaseSchema,
  InsightDataSchema,
  MatchBaseSchema,
  ResumeBaseSchema,
  ResumeDataSchema,
  TInsightBase,
  TInsightCreateDTO,
  TInsightData,
  TResumeBase,
  TResumeData,
} from '@redundant/common';
import OpenAI from 'openai';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssistantService {
  private readonly logger = new Logger(AssistantService.name);
  private openai: OpenAI;
  private resumeParserAssistantId: string =
    process.env.RESUME_PARSER_ASSISTANT_ID ?? '';
  private resumeModifierAssistantId: string =
    process.env.RESUME_MODIFIER_ASSISTANT_ID ?? '';
  private insightGeneratorAssistantId: string =
    process.env.INSIGHT_GENERATOR_ASSISTANT_ID ?? '';

  constructor(private readonly prismaService: PrismaService) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  private cleanOutput(output: string): string {
    this.logger.debug(`Cleaning raw output`);
    const cleaned = output
      .replace(/\\n/g, '')
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();
    this.logger.debug(`Cleaned output length: ${cleaned.length} characters`);
    return cleaned;
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

  async createAssistantInsights({
    applicationId,
  }: {
    applicationId: string;
  }): Promise<TInsightData[]> {
    this.logger.log(
      `Starting insight generation for application ${applicationId}`,
    );

    const application = await this.prismaService.application.findUnique({
      where: { id: applicationId },
      include: { resume: true, match: true },
    });

    if (!application) {
      this.logger.error(`Application ${applicationId} not found`);
      throw new Error('Application not found');
    }

    this.logger.debug(`Found application with resume and match data`);

    const resume = ResumeBaseSchema.parse(application.resume);
    const match = MatchBaseSchema.parse(application.match);

    const resumeText = JSON.stringify(resume.data);
    const jobDescription = match.longDescription;

    this.logger.log(
      `Sending request to OpenAI assistant for insights generation`,
    );

    const output = await this.getAssistantOutput({
      assistantId: this.insightGeneratorAssistantId,
      userInput: `Here is the resume: ${resumeText}\n\nHere is the job description: ${jobDescription}`,
    });

    this.logger.debug(`Received raw output from OpenAI assistant`);

    const cleanedOutput = this.cleanOutput(output);
    this.logger.debug(`Cleaned output from assistant`);

    try {
      const parsedOutput: ExpectedOutput = JSON.parse(cleanedOutput);
      this.logger.debug(`Successfully parsed JSON output`);

      type ExpectedOutput = {
        data: TInsightData[];
      };

      this.logger.log(`Generated ${parsedOutput.data.length} insights`);
      return parsedOutput.data;
    } catch (error) {
      this.logger.error(
        `Failed to parse assistant output: ${error.message}`,
        error.stack,
      );
      this.logger.error(`Raw output: ${cleanedOutput}`);
      throw new Error('Failed to parse assistant output');
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
      ${input}`;

    if (includeJobDescription) {
      const application = await this.prismaService.application.findUnique({
        where: {
          resumeId_matchId: { resumeId: resume.id, matchId: resume.matchId },
        },
        include: { match: true },
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
      this.logger.debug(`Creating new thread for assistant ${assistantId}`);
      const thread = await this.openai.beta.threads.create();

      this.logger.debug(`Created thread ${thread.id}`);
      await this.openai.beta.threads.messages.create(thread.id, {
        role: 'user',
        content: userInput,
      });

      this.logger.log(`Starting assistant run`);
      const run = await this.openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistantId,
      });

      this.logger.debug(`Waiting for run ${run.id} to complete`);
      let runStatus = await this.openai.beta.threads.runs.retrieve(
        thread.id,
        run.id,
      );

      let attempts = 0;
      while (runStatus.status !== 'completed') {
        attempts++;
        this.logger.debug(
          `Run status: ${runStatus.status} (attempt ${attempts})`,
        );

        if (runStatus.status === 'failed') {
          this.logger.error(`Run failed`, runStatus);
          throw new Error('Assistant run failed');
        }

        if (attempts > 60) {
          this.logger.error(`Run timed out after ${attempts} attempts`);
          throw new Error('Assistant run timed out');
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
        runStatus = await this.openai.beta.threads.runs.retrieve(
          thread.id,
          run.id,
        );
      }

      this.logger.debug(`Run completed, retrieving messages`);
      const messages = await this.openai.beta.threads.messages.list(thread.id);

      const lastAssistantMessage = messages.data
        .filter((message) => message.role === 'assistant')
        .pop();

      if (
        lastAssistantMessage &&
        lastAssistantMessage.content[0].type === 'text'
      ) {
        this.logger.debug(`Successfully retrieved assistant response`);
        return lastAssistantMessage.content[0].text.value;
      } else {
        this.logger.error(`No valid response from assistant`);
        return 'No response from assistant.';
      }
    } catch (error) {
      this.logger.error(
        `Error in getAssistantOutput: ${error.message}`,
        error.stack,
      );
      throw new Error('Failed to get assistant output');
    }
  }
}
