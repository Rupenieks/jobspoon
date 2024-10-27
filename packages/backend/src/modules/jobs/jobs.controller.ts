import { Controller, Param, Post } from '@nestjs/common';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post('search/:resumeId')
  async searchJobs(@Param('resumeId') resumeId: string) {
    return this.jobsService.fetchJobs(resumeId);
  }
}
