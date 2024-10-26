import { Module } from '@nestjs/common';
import { AssistantModule } from '../assistant/assistant.module';
import { ResumeParserService } from './resume-parser.service';
import { ResumeParserController } from './resume-parser.controller';

@Module({
  imports: [AssistantModule],
  controllers: [ResumeParserController],
  providers: [ResumeParserService],
})
export class ResumeParserModule {}
