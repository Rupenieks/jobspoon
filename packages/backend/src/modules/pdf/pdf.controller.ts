import {
  Controller,
  Get,
  Param,
  Res,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { PDFService } from './pdf.service';

@Controller('pdf')
@UseGuards(AuthGuard('jwt'))
export class PDFController {
  constructor(private readonly pdfService: PDFService) {}

  @Get(':resumeId')
  async generatePDF(
    @Param('resumeId') resumeId: string,
    @Request() req,
    @Res() res: Response,
  ) {
    const buffer = await this.pdfService.generatePDF(resumeId, req.user.userId);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=resume.pdf',
      'Content-Length': buffer.length,
    });

    res.send(buffer);
  }
}
