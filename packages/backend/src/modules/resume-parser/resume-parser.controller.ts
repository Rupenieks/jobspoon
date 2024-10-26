import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResumeParserService } from './resume-parser.service';
import { TResume } from '@redundant/common';

@Controller('resume-parser')
export class ResumeParserController {
  constructor(private readonly resumeParserService: ResumeParserService) {}

  @Post('process')
  @UseInterceptors(FileInterceptor('file'))
  async processResume(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<TResume> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      const parsedResume = await this.resumeParserService.parseResume(
        file.buffer,
      );
      return parsedResume;
    } catch (error) {
      console.error('Error processing resume:', error);
      throw new InternalServerErrorException('Error processing resume');
    }
  }
}
