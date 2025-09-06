import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsGateway } from './events.gateway';
import { SseController } from './sse.controller';

@Module({
  providers: [EventsService, EventsGateway],
  controllers: [SseController],
  exports: [EventsService],
})
export class EventsModule {}

