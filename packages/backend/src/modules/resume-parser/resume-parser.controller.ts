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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResumeParserService } from './resume-parser.service';
import { TResume } from '@redundant/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('resume-parser')
@UseGuards(AuthGuard('jwt'))
export class ResumeParserController {
  constructor(private readonly resumeParserService: ResumeParserService) {}

  @Post('process')
  @UseInterceptors(FileInterceptor('file'))
  async processResume(
    @UploadedFile() file: Express.Multer.File,
    @Body('text') text: string,
    @Request() req,
  ): Promise<TResume> {
    if (!file && !text) {
      throw new BadRequestException('No file or text provided');
    }

    try {
      let parsedResume: TResume;
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
  async getAllResumes(@Request() req): Promise<TResume[]> {
    try {
      const resumes = await this.resumeParserService.getAllResumesForUser(
        req.user.id,
      );
      return resumes;
    } catch (error) {
      console.error('Error fetching resumes:', error);
      throw new InternalServerErrorException('Error fetching resumes');
    }
  }

  @Put(':id')
  async updateResume(
    @Param('id') id: string,
    @Body() resumeData: Partial<TResume>,
    @Request() req,
  ): Promise<TResume> {
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
  async getResume(@Param('id') id: string, @Request() req): Promise<TResume> {
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
}
