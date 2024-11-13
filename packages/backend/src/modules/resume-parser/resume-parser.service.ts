import { Injectable, NotFoundException } from '@nestjs/common';

import * as pdf from 'pdf-parse';
import { AssistantService } from '../assistant/assistant.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  TResumeBase,
  TResumeData,
  ResumeBaseSchema,
  TResumeWithMatches,
  ResumeWithMatchesSchema,
  TResumeFull,
  ResumeFullSchema,
} from '@redundant/common';
import { StorageService } from '../storage/storage.service';
import { UserService } from '../user/user.service';

@Injectable()
export class ResumeParserService {
  constructor(
    private readonly assistantService: AssistantService,
    private readonly prismaService: PrismaService,
    private readonly storageService: StorageService,
    private readonly userService: UserService,
  ) {}

  async parseResume(buffer: Buffer, userId: string): Promise<TResumeBase> {
    const text = await this.parsePdfToText(buffer);
    const parsedResume = await this.assistantService.parseResume(text);
    const storedResume = await this.storeResume(parsedResume, userId);
    return storedResume;
  }

  async onboardingCreate(userId: string): Promise<TResumeBase[]> {
    const user = await this.userService.findById(userId);
    const newResumes = user.desiredJobTitles.map((title) => {
      return {
        data: {
          personalInfo: {
            positionName: title,
            fullName: user.fullName,
            country: user.country,
            city: user.city,
          },
        },
      };
    });

    const storedResumes = await Promise.all(
      newResumes.map((resume) => this.storeResume(resume.data, userId)),
    );
    return storedResumes;
  }

  private async parsePdfToText(buffer: Buffer): Promise<string> {
    const data = await pdf(buffer);
    return data.text;
  }

  async storeResume(
    resumeData: TResumeData,
    userId: string,
  ): Promise<TResumeBase> {
    const stored = await this.prismaService.resume.create({
      data: {
        userId,
        data: resumeData,
      },
    });

    const parsed = ResumeBaseSchema.parse(stored);

    return parsed;
  }

  async getAllResumesForUser(userId: string): Promise<TResumeBase[]> {
    const resumes = await this.prismaService.resume.findMany({
      where: { userId },
      include: {
        matches: true,
        applications: true,
        jobMatchRun: true,
      },
    });

    return resumes.map((resume) => ResumeBaseSchema.parse(resume));
  }

  async getResumesWithMatches(userId: string): Promise<TResumeWithMatches[]> {
    const resumes = await this.prismaService.resume.findMany({
      where: {
        userId,
      },
      include: {
        matches: true,
        jobMatchRun: true,
      },
    });

    return resumes.map((resume) => ResumeWithMatchesSchema.parse(resume));
  }

  async parseResumeText(text: string, userId: string): Promise<TResumeBase> {
    const parsedResume = await this.assistantService.parseResume(text);
    return await this.storeResume(parsedResume, userId);
  }

  async updateResume(
    id: string,
    resumeData: Partial<TResumeData>,
    userId: string,
  ): Promise<TResumeFull> {
    const resume = await this.prismaService.resume.findUnique({
      where: { id },
    });

    const parsed = ResumeFullSchema.parse(resume);

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
        data: newData,
      },
    });

    const parsedUpdated = ResumeFullSchema.parse(updatedResume);

    return parsedUpdated;
  }

  async updateResumeImages(
    id: string,
    file: Express.Multer.File,
    userId: string,
  ): Promise<TResumeBase> {
    const profileImageUrl = await this.storageService.uploadImage(
      file,
      'profile',
    );
    return await this.updateResume(
      id,
      { profileImage: profileImageUrl },
      userId,
    );
  }

  async getResumeById(id: string, userId: string): Promise<TResumeWithMatches> {
    const resume = await this.prismaService.resume.findUnique({
      where: { id, userId },
      include: {
        matches: true,
        jobMatchRun: true,
      },
    });

    const parsed = ResumeWithMatchesSchema.parse(resume);

    if (!resume || resume.userId !== userId) {
      throw new NotFoundException(
        `Resume with ID ${id} not found or unauthorized`,
      );
    }

    return parsed;
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
