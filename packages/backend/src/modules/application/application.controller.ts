import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApplicationService } from './application.service';

@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post()
  async createApplication(@Body() data: { resumeId: string; matchId: string }) {
    return this.applicationService.createApplication(
      data.resumeId,
      data.matchId,
    );
  }

  @Get()
  async getAllApplications() {
    return this.applicationService.getAllApplications();
  }

  @Get(':id')
  async getApplication(@Param('id') id: string) {
    return this.applicationService.getApplication(id);
  }
}
