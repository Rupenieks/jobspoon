import { Module } from '@nestjs/common';
import { AssistantModule } from '../assistant/assistant.module';
import { ResumeParserService } from './resume-parser.service';
import { ResumeParserController } from './resume-parser.controller';
import { StorageModule } from '../storage/storage.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [AssistantModule, StorageModule, UserModule],
  controllers: [ResumeParserController],
  providers: [ResumeParserService],
  exports: [ResumeParserService],
})
export class ResumeParserModule {}
