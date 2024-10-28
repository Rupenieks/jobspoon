import { Module } from '@nestjs/common';
import { AssistantModule } from '../assistant/assistant.module';
import { ResumeParserService } from './resume-parser.service';
import { ResumeParserController } from './resume-parser.controller';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [AssistantModule, StorageModule],
  controllers: [ResumeParserController],
  providers: [ResumeParserService],
})
export class ResumeParserModule {}
