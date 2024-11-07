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

  async fetchJobs(resumeId: string): Promise<number> {
    const resume = await this.prismaService.resume.findUnique({
      where: { id: resumeId },
    });

    if (!resume) {
      throw new NotFoundException(`Resume with ID ${resumeId} not found`);
    }

    const parsedResume = ResumeBaseSchema.parse(resume);

    try {
      const jobs = await this.theirStackService.searchJobs(parsedResume);
      await this.createMatches({ resumeId, matches: jobs });
      return jobs.length;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return 0;
    }
  }

  private async createMatches({
    resumeId,
    matches,
  }: {
    resumeId: string;
    matches: TMatchBase[];
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
