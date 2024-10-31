import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ApplicationService {
  constructor(private prisma: PrismaService) {}

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
      return this.prisma.$transaction(async (prisma) => {
        // Create a duplicate resume for this application
        const duplicatedResume = await prisma.resume.create({
          data: {
            data: resume.data,
            userId: resume.userId,
            id: undefined, // Remove the id field
            createdAt: undefined, // Let Prisma set the current timestamp
            updatedAt: undefined, // Let Prisma set the current timestamp
          },
        });

        return await prisma.application.create({
          data: {
            resumeId: duplicatedResume.id,
            matchId,
          },
          include: { resume: true, match: true },
        });
      });
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
      include: { resume: true, match: true },
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
}
