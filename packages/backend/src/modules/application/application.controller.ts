import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { ApplicationService } from './application.service';

@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post()
  async createApplication(@Body() data: { resumeId: string; matchId: string }) {
    return await this.applicationService.createApplication(
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

  @Get('resume/:id')
  async getApplicationsByResume(@Param('id') id: string) {
    return this.applicationService.getApplicationsByResume(id);
  }

  @Delete()
  async deleteApplications(@Body() data: { ids: string[] }) {
    await this.applicationService.deleteApplications(data.ids);
    return { message: 'Applications deleted successfully' };
  }

  @Patch(':id/stage')
  async updateApplicationStage(
    @Param('id') id: string,
    @Body() data: { stage: string },
  ) {
    return this.applicationService.updateApplicationStage(id, data.stage);
  }
}
