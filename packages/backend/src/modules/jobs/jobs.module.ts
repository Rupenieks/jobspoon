import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { JobsIntegrationModule } from '../jobs-integration/jobs-integration.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [JobsIntegrationModule, PrismaModule],
  providers: [JobsService],
  controllers: [JobsController],
})
export class JobsModule {}
