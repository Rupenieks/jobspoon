import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InsightService {
  constructor(private prisma: PrismaService) {}

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

  async getInsightsByApplication(applicationId: string) {
    return this.prisma.insight.findMany({
      where: {
        applicationId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
