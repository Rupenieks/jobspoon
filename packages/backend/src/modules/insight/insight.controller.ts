import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { InsightService } from './insight.service';

@Controller('insights')
export class InsightController {
  constructor(private readonly insightService: InsightService) {}

  @Post()
  async createInsight(
    @Body()
    data: {
      applicationId: string;
      stage: string;
      data: {
        title: string;
        description: string;
        resumeChangeData?: any;
      };
    },
  ) {
    return this.insightService.createInsight(data);
  }

  @Get('application/:applicationId')
  async getInsightsByApplication(
    @Param('applicationId') applicationId: string,
  ) {
    return this.insightService.getInsightsByApplication(applicationId);
  }
}
