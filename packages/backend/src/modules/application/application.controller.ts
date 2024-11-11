import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Patch,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { ApplicationService } from './application.service';

@Controller('applications')
@UseGuards(AuthGuard('jwt'))
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post()
  async createApplication(
    @Body() data: { resumeId: string; matchId: string },
    @Req() req,
  ) {
    return await this.applicationService.createApplication(
      data.resumeId,
      data.matchId,
      req.user.userId,
    );
  }

  @Get()
  async getAllApplications() {
    return this.applicationService.getAllApplications();
  }

  @Get(':id')
  async getApplication(@Param('id') id: string, @Req() req) {
    return this.applicationService.getApplication(id, req.user.userId);
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

  @Post(':id/interview-materials')
  @UseInterceptors(FilesInterceptor('files', 5)) // Max 5 files
  async submitInterviewMaterials(
    @Param('id') applicationId: string,
    @Body('notes') notes: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.applicationService.processInterviewMaterials(
      applicationId,
      notes,
      files,
    );
  }
}
