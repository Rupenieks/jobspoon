import { Injectable, NotFoundException } from '@nestjs/common';
import { ResumeBaseSchema, TMatchBase } from '@redundant/common';
import { TheirStackService } from '../jobs-integration/their-stack.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JobsService {
  constructor(
    private readonly theirStackService: TheirStackService,
    private readonly prismaService: PrismaService,
  ) {}

  async canUserRunJobMatch(userId: string, resumeId: string): Promise<boolean> {
    // Check if the user has run a job match today per resume
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

  private async getLastRunDate(resumeId: string): Promise<Date | null> {
    const lastRun = await this.prismaService.jobMatchRun.findFirst({
      where: {
        resumeId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return lastRun?.createdAt || null;
  }

  async fetchJobs(resumeId: string, userId: string): Promise<number> {
    const canRun = await this.canUserRunJobMatch(userId, resumeId);
    if (!canRun) {
      throw new Error(
        'You can only run job matching once per day for each resume',
      );
    }

    const resume = await this.prismaService.resume.findUnique({
      where: { id: resumeId },
    });

    if (!resume) {
      throw new NotFoundException(`Resume with ID ${resumeId} not found`);
    }

    const lastRunDate = await this.getLastRunDate(resumeId);
    const parsedResume = ResumeBaseSchema.parse(resume);

    try {
      const jobMatchRun = await this.prismaService.jobMatchRun.create({
        data: {
          userId,
          resumeId,
        },
      });

      const jobs = await this.theirStackService.searchJobs(
        parsedResume,
        lastRunDate,
      );
      await this.createMatches({
        resumeId,
        matches: jobs,
        userId,
        jobMatchRunId: jobMatchRun.id,
      });

      return jobs.length;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return 0;
    }
  }

  private async createMatches({
    resumeId,
    matches,
    userId,
    jobMatchRunId,
  }: {
    resumeId: string;
    matches: TMatchBase[];
    userId: string;
    jobMatchRunId: string;
  }): Promise<void> {
    for (const match of matches) {
      if (!match.integrationId) {
        console.error('Job is missing integrationId:', match);
        continue;
      }

      await this.prismaService.match.upsert({
        where: {
          resumeId_integrationId: {
            resumeId,
            integrationId: match.integrationId,
          },
        },
        update: {
          ...match,
          jobMatchRunId,
        },
        create: {
          integrationId: match.integrationId,
          country: match.country,
          city: match.city,
          positionTitle: match.positionTitle,
          companyName: match.companyName,
          companyUrl: match.companyUrl,
          seniority: match.seniority,
          description: match.description,
          longDescription: match.longDescription,
          applyUrl: match.applyUrl,
          provider: match.provider,
          domain: match.domain,
          longitude: match.longitude,
          latitude: match.latitude,
          datePosted: match.datePosted,
          hybrid: match.hybrid,
          remote: match.remote,
          salary: match.salary,
          reposted: match.reposted,
          dateReposted: match.dateReposted,
          hiringTeam: match.hiringTeam,
          company: match.company,
          user: {
            connect: {
              id: userId,
            },
          },
          resume: {
            connect: {
              id: resumeId,
            },
          },
        },
      });
    }
  }
}
