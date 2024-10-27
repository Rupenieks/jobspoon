import { Injectable } from '@nestjs/common';
import { AssistantService } from '../assistant/assistant.service';
import { PrismaService } from '../prisma/prisma.service';
import * as pdf from 'pdf-parse';
import { TApplication, TMatch, TResume } from '@redundant/common';
import { parseResumeFields } from 'src/utils/resumeParser';

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
}
