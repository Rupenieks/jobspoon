import { Injectable, Logger } from '@nestjs/common';
import { AssistantService } from '../assistant/assistant.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InsightService {
  private readonly logger = new Logger(InsightService.name);
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

  async startInterviewAssistance({
    applicationId,
    payload,
    resumeId,
    matchId,
  }: {
    applicationId: string;
    payload: {
      userInput: string;
      parsedFileData: string;
    };
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
          applicationStage: 'interview',
          status: 'STARTED',
          resumeId,
          matchId,
        },
      });

    this.logger.log(
      `Starting interview assistance for application ${applicationId}`,
    );

    this.getInterviewInsightsAndSave({
      insightGenerationRequestId: request.id,
      applicationId,
      payload,
    });

    return request;
  }

  async getInterviewInsightsAndSave({
    insightGenerationRequestId,
    applicationId,
    payload,
  }: {
    insightGenerationRequestId: string;
    applicationId: string;
    payload: {
      userInput: string;
      parsedFileData: string;
    };
  }) {
    try {
      const insights = await this.assistantService.createInterviewAssistance({
        applicationId,
        payload,
      });

      this.logger.log(`Generated interview insights`, {
        insightCount: insights.length,
      });

      // Create single insight with all data
      const insight = await this.prisma.insight.create({
        data: {
          applicationId,
          stage: 'interview',
          data: insights,
        },
      });

      this.logger.log(`Saved application insight`, {
        insightId: insight.id,
        stage: 'interview',
      });

      // Update request with success
      await this.prisma.applicationInsightGenerationRequest.update({
        where: { id: insightGenerationRequestId },
        data: {
          status: 'SUCCESS',
          generatedInsightId: insight.id,
        },
      });

      this.logger.log(`Updated interview assistance request`, {
        insightGenerationRequestId,
        status: 'SUCCESS',
      });
    } catch (error) {
      // Update request with error
      await this.prisma.applicationInsightGenerationRequest.update({
        where: { id: insightGenerationRequestId },
        data: {
          status: 'ERROR',
        },
      });

      this.logger.error(`Failed to generate interview insights`, {
        insightGenerationRequestId,
        status: 'ERROR',
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
