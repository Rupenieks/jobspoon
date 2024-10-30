import { Injectable, NotFoundException } from '@nestjs/common';
import {
  deserializeResume,
  ResumeRawModelSchema,
  serializeResume,
  TResumeData,
  TResumeModel,
} from '@redundant/common';
import * as pdf from 'pdf-parse';
import { AssistantService } from '../assistant/assistant.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResumeParserService {
  constructor(
    private readonly assistantService: AssistantService,
    private readonly prismaService: PrismaService,
  ) {}

  async parseResume(buffer: Buffer, userId: string): Promise<TResumeModel> {
    const text = await this.parsePdfToText(buffer);
    const parsedResume = await this.assistantService.parseResume(text);
    const storedResume = await this.storeResume(parsedResume, userId);
    return storedResume;
  }

  private async parsePdfToText(buffer: Buffer): Promise<string> {
    const data = await pdf(buffer);
    return data.text;
  }

  async storeResume(
    resumeData: TResumeData,
    userId: string,
  ): Promise<TResumeModel> {
    const stored = await this.prismaService.resume.create({
      data: {
        userId,
        data: serializeResume(resumeData),
      },
      include: {
        matches: {
          include: {
            application: true,
          },
        },
        application: true,
      },
    });

    const parsed = ResumeRawModelSchema.parse(stored);

    return deserializeResume(parsed);
  }

  async getAllResumesForUser(userId: string): Promise<TResumeModel[]> {
    const resumes = await this.prismaService.resume.findMany({
      where: { userId },
      include: {
        matches: {
          include: {
            application: true,
          },
        },
        application: true,
      },
    });

    const parsed = resumes.map((resume) => ResumeRawModelSchema.parse(resume));

    return parsed.map((resume) => deserializeResume(resume));
  }

  async parseResumeText(text: string, userId: string): Promise<TResumeModel> {
    const parsedResume = await this.assistantService.parseResume(text);
    return await this.storeResume(parsedResume, userId);
  }

  async updateResume(
    id: string,
    resumeData: Partial<TResumeData>,
    userId: string,
  ): Promise<TResumeModel> {
    const resume = await this.prismaService.resume.findUnique({
      where: { id },
      include: {
        matches: {
          include: {
            application: true,
          },
        },
        application: true,
      },
    });

    const parsed = ResumeRawModelSchema.parse(resume);

    if (!resume || resume.userId !== userId) {
      throw new NotFoundException(
        `Resume with ID ${id} not found or unauthorized`,
      );
    }

    const currentData = parsed.data;
    const newData = {
      ...currentData,
      ...resumeData,
    };

    const updatedResume = await this.prismaService.resume.update({
      where: { id },
      data: {
        data: serializeResume(newData),
      },
      include: {
        matches: {
          include: {
            application: true,
          },
        },
        application: true,
      },
    });

    const parsedUpdated = ResumeRawModelSchema.parse(updatedResume);

    return deserializeResume(parsedUpdated);
  }

  async getResumeById(id: string, userId: string): Promise<TResumeModel> {
    const resume = await this.prismaService.resume.findUnique({
      where: { id },
      include: {
        matches: {
          include: {
            application: true,
          },
        },
        application: true,
      },
    });

    const parsed = ResumeRawModelSchema.parse(resume);

    if (!resume || resume.userId !== userId) {
      throw new NotFoundException(
        `Resume with ID ${id} not found or unauthorized`,
      );
    }

    return deserializeResume(parsed);
  }

  async deleteResumes(ids: string[], userId: string): Promise<void> {
    await this.prismaService.resume.deleteMany({
      where: {
        id: { in: ids },
        userId,
      },
    });
  }
}
