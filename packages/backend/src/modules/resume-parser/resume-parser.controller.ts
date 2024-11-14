import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  InternalServerErrorException,
  UseGuards,
  Request,
  Body,
  Get,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResumeParserService } from './resume-parser.service';
import { AuthGuard } from '@nestjs/passport';
import {
  TResumeBase,
  TResumeData,
  TResumeFull,
  TResumeWithMatches,
  TResumesWithRunsRemaining,
} from '@redundant/common';

@Controller('resume-parser')
@UseGuards(AuthGuard('jwt'))
export class ResumeParserController {
  constructor(private readonly resumeParserService: ResumeParserService) {}

  @Post('onboarding-create')
  async onboardingCreate(@Request() req): Promise<TResumeBase[]> {
    return await this.resumeParserService.onboardingCreate(req.user.userId);
  }

  @Post('process')
  @UseInterceptors(FileInterceptor('file'))
  async processResume(
    @UploadedFile() file: Express.Multer.File,
    @Body('text') text: string,
    @Request() req,
  ): Promise<TResumeBase> {
    if (!file && !text) {
      throw new BadRequestException('No file or text provided');
    }

    try {
      let parsedResume: TResumeBase;
      if (file) {
        parsedResume = await this.resumeParserService.parseResume(
          file.buffer,
          req.user.userId,
        );
      } else {
        parsedResume = await this.resumeParserService.parseResumeText(
          text,
          req.user.userId,
        );
      }
      return parsedResume;
    } catch (error) {
      console.error('Error processing resume:', error);
      throw new InternalServerErrorException('Error processing resume');
    }
  }

  @Get('all')
  async getAllResumes(@Request() req): Promise<TResumeBase[]> {
    try {
      const resumes = await this.resumeParserService.getAllResumesForUser(
        req.user.userId,
      );
      return resumes;
    } catch (error) {
      console.error('Error fetching resumes:', error);
      throw new InternalServerErrorException('Error fetching resumes');
    }
  }

  @Get('matches')
  async getResumesWithMatches(
    @Request() req,
  ): Promise<TResumesWithRunsRemaining> {
    return this.resumeParserService.getResumesWithMatches(req.user.userId);
  }

  @Put(':id/images')
  @UseInterceptors(FileInterceptor('profileImage'))
  async updateResumeImages(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ): Promise<TResumeBase> {
    return await this.resumeParserService.updateResumeImages(
      id,
      file,
      req.user.userId,
    );
  }

  @Put(':id')
  async updateResume(
    @Param('id') id: string,
    @Body() resumeData: Partial<TResumeData>,
    @Request() req,
  ): Promise<TResumeBase> {
    try {
      const updatedResume = await this.resumeParserService.updateResume(
        id,
        resumeData,
        req.user.userId,
      );
      return updatedResume;
    } catch (error) {
      console.error('Error updating resume:', error);
      throw new InternalServerErrorException('Error updating resume');
    }
  }

  @Get(':id')
  async getResume(
    @Param('id') id: string,
    @Request() req,
  ): Promise<TResumeFull> {
    try {
      const resume = await this.resumeParserService.getResumeById(
        id,
        req.user.userId,
      );
      return resume;
    } catch (error) {
      console.error('Error fetching resume:', error);
      throw new InternalServerErrorException('Error fetching resume');
    }
  }

  @Delete()
  async deleteResumes(@Body('ids') ids: string[], @Request() req) {
    try {
      await this.resumeParserService.deleteResumes(ids, req.user.userId);
      return { message: 'Resumes deleted successfully' };
    } catch (error) {
      console.error('Error deleting resumes:', error);
      throw new InternalServerErrorException('Error deleting resumes');
    }
  }
}
