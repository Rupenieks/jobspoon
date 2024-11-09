import { Module } from '@nestjs/common';
import { InsightController } from './insight.controller';
import { InsightService } from './insight.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AssistantModule } from '../assistant/assistant.module';

@Module({
  imports: [PrismaModule, AssistantModule],
  controllers: [InsightController],
  providers: [InsightService],
  exports: [InsightService],
})
export class InsightModule {}
