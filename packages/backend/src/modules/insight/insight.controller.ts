import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { InsightService } from './insight.service';

@Controller('insights')
export class InsightController {
  constructor(private readonly insightService: InsightService) {}

  @Get('application/:applicationId')
  async getInsightsByApplication(
    @Param('applicationId') applicationId: string,
  ) {
    return this.insightService.getInsightsByApplication(applicationId);
  }

  @Get('application/:applicationId/generation-request')
  async getGenerationRequest(
    @Param('applicationId') applicationId: string,
    @Query('stage') stage: string,
  ) {
    return this.insightService.getGenerationRequest(applicationId, stage);
  }
}
