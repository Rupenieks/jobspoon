import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AssistantModule } from './modules/assistant/assistant.module';
import { ResumeParserModule } from './modules/resume-parser/resume-parser.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [AssistantModule, ResumeParserModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
