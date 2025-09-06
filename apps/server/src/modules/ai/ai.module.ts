import { Module } from '@nestjs/common';
import { AiWorker } from './ai.worker';

@Module({
  providers: [AiWorker],
  exports: [AiWorker],
})
export class AiModule {}

