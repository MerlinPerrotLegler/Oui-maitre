import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { EventsGateway } from './events.gateway';

export type EventEnvelope<T = any> = {
  id: string;
  type: string;
  world_id: string;
  at: string;
  request_id?: string;
  data: T;
};

@Injectable()
export class EventsService {
  private sse$ = new Subject<EventEnvelope>();

  constructor(private gateway: EventsGateway) {}

  stream() { return this.sse$.asObservable(); }

  emit<T>(event: EventEnvelope<T>) {
    // WS broadcast by world room
    this.gateway.broadcastToWorld(event.world_id, event);
    // SSE broadcast
    this.sse$.next(event);
  }
}

