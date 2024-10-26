import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AssistantModule } from './modules/assistant/assistant.module';
import { ResumeParserModule } from './modules/resume-parser/resume-parser.module';

@Module({
  imports: [AssistantModule, ResumeParserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
