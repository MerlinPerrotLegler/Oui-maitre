import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsGateway } from './events.gateway';
import { SseController } from './sse.controller';
import { OutboxService } from './outbox.service';

@Module({
  providers: [EventsService, EventsGateway, OutboxService],
  controllers: [SseController],
  exports: [EventsService, OutboxService],
})
export class EventsModule {}
