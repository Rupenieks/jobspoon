import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InsightService } from '../insight/insight.service';

@Injectable()
export class ApplicationService {
  constructor(
    private prisma: PrismaService,
    private insightService: InsightService,
  ) {}

  async createApplication(resumeId: string, matchId: string) {
    const resume = await this.prisma.resume.findUnique({
      where: { id: resumeId },
    });

    if (!resume) {
      throw new NotFoundException(`Resume with ID ${resumeId} not found`);
    }

    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
    });
    if (!match) {
      throw new NotFoundException(`Match with ID ${matchId} not found`);
    }

    // Check if an application already exists for this resume and match
    const existingApplication = await this.prisma.application.findFirst({
      where: {
        resumeId,
        matchId,
      },
    });

    if (existingApplication) {
      throw new Error(
        'An application already exists for this resume and match',
      );
    }

    try {
      // Wrap the creation of duplicate resume and application in a transaction
      const application = await this.prisma.$transaction(async (prisma) => {
        // Create a duplicate resume for this application
        const duplicatedResume = await prisma.resume.create({
          data: {
            data: resume.data,
            userId: resume.userId,
            matchId,
          },
        });

        const application = await prisma.application.create({
          data: {
            resumeId: duplicatedResume.id,
            matchId,
          },
        });

        await prisma.resume.update({
          where: { id: resumeId },
          data: { applicationId: application.id },
        });

        // After creating the application, trigger insight generation

        return application;
      });

      this.insightService
        .startInsightCreationProcess({
          applicationId: application.id,
          stage: 'not_applied',
          resumeId: application.resumeId,
          matchId,
        })
        .catch((error) => {
          console.error('Error generating insights:', error);
        });

      return application;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getAllApplications() {
    return this.prisma.application.findMany({
      include: { resume: true, match: true },
    });
  }

  async getApplication(id: string) {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: { resume: true, match: true, insights: true },
    });

    return application;
  }

  async deleteApplications(ids: string[]): Promise<void> {
    await this.prisma.application.deleteMany({
      where: {
        id: { in: ids },
      },
    });
  }

  async getApplicationsByResume(resumeId: string) {
    return this.prisma.application.findFirst({
      where: { resumeId },
      include: { match: true },
    });
  }

  async updateApplicationStage(id: string, stage: string) {
    const updatedApplication = await this.prisma.application.update({
      where: { id },
      data: { stage },
      include: { resume: true, match: true },
    });

    const stagesToGenerateInsightsFor = ['applied', 'notApplied'];

    if (stagesToGenerateInsightsFor.includes(stage)) {
      this.insightService
        .startInsightCreationProcess({
          applicationId: updatedApplication.id,
          stage,
          resumeId: updatedApplication.resumeId,
          matchId: updatedApplication.matchId,
        })
        .catch((error) => {
          console.error('Error generating insights:', error);
        });
    }

    return updatedApplication;
  }
}
