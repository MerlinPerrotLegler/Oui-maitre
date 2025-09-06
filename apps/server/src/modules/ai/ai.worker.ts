import { Injectable, Logger } from '@nestjs/common';
import { Queue, Worker, QueueScheduler, JobsOptions } from 'bullmq';

@Injectable()
export class AiWorker {
  private logger = new Logger('AiWorker');
  private queue?: Queue;
  private worker?: Worker;
  private scheduler?: QueueScheduler;

  constructor() {
    const connection = process.env.REDIS_URL ? { connection: { url: process.env.REDIS_URL } as any } : undefined;
    if (!connection) {
      this.logger.warn('REDIS_URL not set; AI worker disabled');
      return;
    }
    this.queue = new Queue('ai-metadata', connection);
    this.scheduler = new QueueScheduler('ai-metadata', connection);
    this.worker = new Worker('ai-metadata', async (job) => {
      this.logger.log(`Recompute AI metadata for ${job.name}`);
      // TODO: compute and persist ai_schema/summary/tips if stored separately
    }, connection);
  }

  async enqueue(entity: { type: 'item'|'sheet'; id: string }, opts?: JobsOptions) {
    if (!this.queue) return;
    await this.queue.add(`${entity.type}:${entity.id}`, entity, opts);
  }
}

