import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { PDFController } from './pdf.controller';
import { PDFService } from './pdf.service';
import { ResumeParserModule } from '../resume-parser/resume-parser.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [ConfigModule, HttpModule, ResumeParserModule, StorageModule],
  controllers: [PDFController],
  providers: [PDFService],
})
export class PDFModule {}
