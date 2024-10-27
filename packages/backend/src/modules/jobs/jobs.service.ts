import { Injectable, NotFoundException } from '@nestjs/common';
import { TheirStackService } from '../jobs-integration/their-stack.service';
import { PrismaService } from '../prisma/prisma.service';
import { TResume } from '@redundant/common';

@Injectable()
export class JobsService {
  constructor(
    private readonly theirStackService: TheirStackService,
    private readonly prismaService: PrismaService,
  ) {}

  async fetchJobs(resumeId: string): Promise<any[]> {
    const resume = await this.prismaService.resume.findUnique({
      where: { id: resumeId },
    });

    if (!resume) {
      throw new NotFoundException(`Resume with ID ${resumeId} not found`);
    }

    const parsedResume: TResume = {
      ...resume,
      experience: resume.experience
        ? JSON.parse(resume.experience as string)
        : null,
      education: resume.education
        ? JSON.parse(resume.education as string)
        : null,
      references: resume.references
        ? JSON.parse(resume.references as string)
        : null,
    };

    try {
      const jobs = await this.theirStackService.searchJobs(parsedResume);
      return jobs.jobs || [];
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return [];
    }
  }
}
