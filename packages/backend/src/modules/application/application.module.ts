import { Module } from '@nestjs/common';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';
import { PrismaService } from '../prisma/prisma.service';
import { InsightModule } from '../insight/insight.module';

@Module({
  controllers: [ApplicationController],
  providers: [ApplicationService, PrismaService],
  imports: [InsightModule],
})
export class ApplicationModule {}
