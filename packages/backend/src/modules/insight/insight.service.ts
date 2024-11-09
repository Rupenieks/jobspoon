import { Injectable } from '@nestjs/common';
import { AssistantService } from '../assistant/assistant.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InsightService {
  constructor(
    private prisma: PrismaService,
    private assistantService: AssistantService,
  ) {}

  async createInsight(data: {
    applicationId: string;
    stage: string;
    data: {
      title: string;
      description: string;
      resumeChangeData?: any;
    };
  }) {
    return this.prisma.insight.create({
      data: {
        applicationId: data.applicationId,
        stage: data.stage,
        data: data.data,
      },
      include: {
        application: true,
      },
    });
  }

  async getInsightsByApplication(applicationId: string, stage?: string) {
    return this.prisma.insight.findMany({
      where: {
        applicationId,
        stage,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getInsightsAndSave({
    insightGenerationRequestId,
    applicationId,
    stage,
  }: {
    insightGenerationRequestId: string;
    applicationId: string;
    stage: string;
  }) {
    try {
      const insights = await this.assistantService.createAssistantInsights({
        applicationId,
      });

      // Create single insight with all data
      const insight = await this.prisma.insight.create({
        data: {
          applicationId,
          stage,
          data: insights,
        },
      });

      // Update request with success
      await this.prisma.applicationInsightGenerationRequest.update({
        where: { id: insightGenerationRequestId },
        data: {
          status: 'SUCCESS',
          generatedInsightId: insight.id,
        },
      });

      return insight;
    } catch (error) {
      // Update request with error
      await this.prisma.applicationInsightGenerationRequest.update({
        where: { id: insightGenerationRequestId },
        data: {
          status: 'ERROR',
        },
      });
      throw error;
    }
  }

  async startInsightCreationProcess({
    applicationId,
    stage,
    resumeId,
    matchId,
  }: {
    applicationId: string;
    stage: string;
    resumeId: string;
    matchId: string;
  }) {
    // Create generation request
    const request =
      await this.prisma.applicationInsightGenerationRequest.create({
        data: {
          application: {
            connect: {
              id: applicationId,
            },
          },
          applicationStage: stage,
          status: 'STARTED',
          resumeId,
          matchId,
        },
      });

    this.getInsightsAndSave({
      insightGenerationRequestId: request.id,
      applicationId,
      stage,
    });

    return request;
  }

  async getGenerationRequest(applicationId: string, stage: string) {
    return await this.prisma.applicationInsightGenerationRequest.findFirst({
      where: {
        applicationId,
        applicationStage: stage,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
