import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  InternalServerErrorException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResumeParserService } from './resume-parser.service';
import { TResume } from '@redundant/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('resume-parser')
@UseGuards(JwtAuthGuard)
export class ResumeParserController {
  constructor(private readonly resumeParserService: ResumeParserService) {}

  @Post('process')
  @UseInterceptors(FileInterceptor('file'))
  async processResume(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ): Promise<TResume> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      const parsedResume = await this.resumeParserService.parseResume(
        file.buffer,
        req.user.id,
      );
      return parsedResume;
    } catch (error) {
      console.error('Error processing resume:', error);
      throw new InternalServerErrorException('Error processing resume');
    }
  }
}
