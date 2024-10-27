import { Controller, Param, Post } from '@nestjs/common';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post('search/:resumeId')
  async searchJobs(@Param('resumeId') resumeId: string) {
    const count = await this.jobsService.fetchJobs(resumeId);
    return { message: 'Job matching completed', count };
  }
}
