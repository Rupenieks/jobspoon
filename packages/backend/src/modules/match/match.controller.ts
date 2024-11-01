import { Controller, Get, Param } from '@nestjs/common';
import { MatchService } from './match.service';
import { TMatchWithApplication } from '@redundant/common';

@Controller('matches')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Get(':id')
  async getMatch(@Param('id') id: string): Promise<TMatchWithApplication> {
    return this.matchService.getMatch(id);
  }

  @Get('resume/:resumeId')
  async getMatchesByResumeId(
    @Param('resumeId') resumeId: string,
  ): Promise<TMatchWithApplication[]> {
    return this.matchService.getMatchesByResumeId(resumeId);
  }
}
