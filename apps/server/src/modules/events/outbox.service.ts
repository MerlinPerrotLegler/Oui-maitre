import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventsService, EventEnvelope } from './events.service';

@Injectable()
export class OutboxService {
  constructor(private prisma: PrismaService, private events: EventsService) {}

  async enqueue<T>(evt: EventEnvelope<T>) {
    await this.prisma.outboxEvent.create({
      data: {
        worldId: evt.world_id,
        type: evt.type,
        requestId: evt.request_id ?? null,
        payload: evt as any,
      },
    });
    // Inline dispatch (no worker yet)
    this.events.emit(evt);
  }
}

