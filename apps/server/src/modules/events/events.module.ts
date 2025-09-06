import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsGateway } from './events.gateway';
import { SseController } from './sse.controller';
import { OutboxService } from './outbox.service';
import { MetricsModule } from '../metrics/metrics.module';

@Module({
  imports: [MetricsModule],
  providers: [EventsService, EventsGateway, OutboxService],
  controllers: [SseController],
  exports: [EventsService, OutboxService],
})
export class EventsModule {}
