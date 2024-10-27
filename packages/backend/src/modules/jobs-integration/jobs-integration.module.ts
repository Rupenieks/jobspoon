import { Module } from '@nestjs/common';
import { TheirStackService } from './their-stack.service';

@Module({
  providers: [TheirStackService],
  exports: [TheirStackService],
})
export class JobsIntegrationModule {}
