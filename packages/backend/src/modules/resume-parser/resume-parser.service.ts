import { Injectable, NotFoundException } from '@nestjs/common';

import {
  ResumeBaseSchema,
  ResumeFullSchema,
  TResumeBase,
  TResumeData,
  TResumeFull,
  TResumeManualCreateDTO,
  TResumesWithRunsRemaining,
} from '@redundant/common';
import * as pdf from 'pdf-parse';
import { AssistantService } from '../assistant/assistant.service';
import { PrismaService } from '../prisma/prisma.service';
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
            profileBio: '',
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
    resumeData: Partial<TResumeData>,
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

  private async checkCanRunJobsMatch(
    resumeId: string,
    userId: string,
  ): Promise<boolean> {
    const lastRun = await this.prismaService.jobMatchRun.findFirst({
      where: {
        userId,
        resumeId,
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)), // Start of today
        },
      },
    });

    return !lastRun;
  }

  private async addCanRunJobsMatch<T extends { id: string; userId: string }>(
    resume: T,
  ): Promise<T & { canRunJobsMatch: boolean }> {
    const canRunJobsMatch = await this.checkCanRunJobsMatch(
      resume.id,
      resume.userId,
    );
    return { ...resume, canRunJobsMatch };
  }

  async getAllResumesForUser(userId: string): Promise<TResumeBase[]> {
    const resumes = await this.prismaService.resume.findMany({
      where: {
        userId,
        applications: {
          none: {}, // This filters out resumes that have applications
        },
        matchId: null,
      },
      include: {
        matches: true,
        applications: true,
        jobMatchRuns: true,
      },
    });

    const resumesWithFlag = await Promise.all(
      resumes.map((resume) => this.addCanRunJobsMatch(resume)),
    );

    return resumesWithFlag.map((resume) => ResumeFullSchema.parse(resume));
  }

  private async getTodayJobRunsCount(userId: string): Promise<number> {
    const today = new Date(new Date().setHours(0, 0, 0, 0));

    const runs = await this.prismaService.jobMatchRun.count({
      where: {
        userId,
        createdAt: {
          gte: today,
        },
      },
    });

    return runs;
  }

  async getJobRunsRemaining(userId: string): Promise<number> {
    const MAX_RUNS_PER_DAY = 3;
    const todayRuns = await this.getTodayJobRunsCount(userId);
    return Math.max(0, MAX_RUNS_PER_DAY - todayRuns);
  }

  async getResumesWithMatches(
    userId: string,
  ): Promise<TResumesWithRunsRemaining> {
    const resumes = await this.prismaService.resume.findMany({
      where: {
        userId,
        applications: {
          none: {}, // This filters out resumes that have applications
        },
        matchId: null,
      },
      include: {
        matches: true,
        applications: true,
        jobMatchRuns: true,
      },
    });

    const resumesWithFlag = await Promise.all(
      resumes.map((resume) => this.addCanRunJobsMatch(resume)),
    );

    const jobRunsRemaining = await this.getJobRunsRemaining(userId);

    return {
      resumes: resumesWithFlag.map((resume) => ResumeFullSchema.parse(resume)),
      jobRunsRemaining,
    };
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
      'pictures',
      userId,
      id,
    );
    return await this.updateResume(
      id,
      { profileImage: profileImageUrl },
      userId,
    );
  }

  async getResumeById(id: string, userId: string): Promise<TResumeFull> {
    const resume = await this.prismaService.resume.findUnique({
      where: { id, userId },
      include: {
        matches: true,
        jobMatchRuns: true,
      },
    });

    if (!resume || resume.userId !== userId) {
      throw new NotFoundException(
        `Resume with ID ${id} not found or unauthorized`,
      );
    }

    const resumeWithFlag = await this.addCanRunJobsMatch(resume);
    return ResumeFullSchema.parse(resumeWithFlag);
  }

  async deleteResumes(ids: string[], userId: string): Promise<void> {
    await this.prismaService.resume.deleteMany({
      where: {
        id: { in: ids },
        userId,
      },
    });
  }

  async manualCreate(
    createDto: TResumeManualCreateDTO,
    userId: string,
  ): Promise<TResumeBase> {
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const resumeData: Partial<TResumeData> = {
      personalInfo: {
        positionName: createDto.positionTitle,
        country: createDto.country,
        city: createDto.city,
        fullName: user.fullName,
        profileBio: '',
      },
      skills: createDto.skills,
    };

    return await this.storeResume(resumeData, userId);
  }
}
