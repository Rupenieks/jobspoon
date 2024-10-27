import { Injectable, NotFoundException } from '@nestjs/common';
import { TResume } from '@redundant/common';
import * as pdf from 'pdf-parse';
import { parseResumeFields } from 'src/utils/resumeParser';
import { AssistantService } from '../assistant/assistant.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResumeParserService {
  constructor(
    private readonly assistantService: AssistantService,
    private readonly prismaService: PrismaService,
  ) {}

  async parseResume(buffer: Buffer, userId: string): Promise<TResume> {
    const text = await this.parsePdfToText(buffer);
    const parsedResume = await this.assistantService.parseResume(text);
    await this.storeResume(parsedResume, userId);
    return parsedResume;
  }

  private async parsePdfToText(buffer: Buffer): Promise<string> {
    const data = await pdf(buffer);
    return data.text;
  }

  private async storeResume(resume: TResume, userId: string): Promise<void> {
    await this.prismaService.resume.create({
      data: {
        user: {
          connect: { id: userId },
        },
        fullName: resume.fullName,
        country: resume.country,
        city: resume.city,
        address: resume.address,
        email: resume.email,
        phoneNumber: resume.phoneNumber,
        positionName: resume.positionName,
        experience: resume.experience
          ? JSON.stringify(resume.experience)
          : null,
        education: resume.education ? JSON.stringify(resume.education) : null,
        skills: resume.skills || [],
        references: resume.references
          ? JSON.stringify(resume.references)
          : null,
      },
    });
  }

  async getAllResumesForUser(userId: string): Promise<TResume[]> {
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

    return resumes.map((resume) =>
      parseResumeFields(resume as unknown as TResume),
    );
  }

  async parseResumeText(text: string, userId: string): Promise<TResume> {
    const parsedResume = await this.assistantService.parseResume(text);
    await this.storeResume(parsedResume, userId);
    return parsedResume;
  }

  async updateResume(
    id: string,
    resumeData: Partial<TResume>,
    userId: string,
  ): Promise<TResume> {
    const resume = await this.prismaService.resume.findUnique({
      where: { id },
      include: {
        matches: true,
        application: true,
      },
    });

    if (!resume || resume.userId !== userId) {
      throw new NotFoundException(
        `Resume with ID ${id} not found or unauthorized`,
      );
    }

    const updatedResume = await this.prismaService.resume.update({
      where: { id },
      data: {
        ...resumeData,
        experience: resumeData.experience
          ? JSON.stringify(resumeData.experience)
          : undefined,
        education: resumeData.education
          ? JSON.stringify(resumeData.education)
          : undefined,
        matches: {
          connect: resume.matches.map((match) => ({ id: match.id })),
        },
        application: {
          connect: resume.application
            ? { id: resume.application.id }
            : undefined,
        },
      },
    });

    return parseResumeFields(updatedResume as unknown as TResume);
  }

  async getResumeById(id: string, userId: string): Promise<TResume> {
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

    if (!resume || resume.userId !== userId) {
      throw new NotFoundException(
        `Resume with ID ${id} not found or unauthorized`,
      );
    }

    return parseResumeFields(resume as unknown as TResume);
  }
}
