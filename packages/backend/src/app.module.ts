import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AssistantModule } from './modules/assistant/assistant.module';
import { ResumeParserModule } from './modules/resume-parser/resume-parser.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { ApplicationModule } from './modules/application/application.module';
import { StorageModule } from './modules/storage/storage.module';
import { MatchModule } from './modules/match/match.module';
import { PDFModule } from './modules/pdf/pdf.module';
import { InsightModule } from './modules/insight/insight.module';
import { EmailModule } from './modules/email/email.module';

@Module({
  imports: [
    AssistantModule,
    ResumeParserModule,
    AuthModule,
    PrismaModule,
    JobsModule,
    ApplicationModule,
    StorageModule,
    MatchModule,
    PDFModule,
    InsightModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
