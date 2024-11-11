import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('jobs')
@UseGuards(AuthGuard('jwt'))
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post('search/:resumeId')
  async searchJobs(@Param('resumeId') resumeId: string, @Req() req) {
    const count = await this.jobsService.fetchJobs(resumeId, req.user.userId);
    return { message: 'Job matching completed', count };
  }
}
