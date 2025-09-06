import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { EventsGateway } from './events.gateway';
import { MetricsService } from '../metrics/metrics.service';

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
  private worldBuffers = new Map<string, { queue: EventEnvelope[]; timer?: NodeJS.Timeout }>();
  private throttleMs = Number(process.env.WS_THROTTLE_MS ?? 50);

  constructor(private gateway: EventsGateway, private metrics: MetricsService) {}

  stream() { return this.sse$.asObservable(); }

  emit<T>(event: EventEnvelope<T>) {
    // SSE immediately
    this.sse$.next(event);
    // WS: throttle per world to reduce backpressure
    if (this.throttleMs <= 0) {
      this.gateway.broadcastToWorld(event.world_id, event);
      return;
    }
    const buf = this.worldBuffers.get(event.world_id) ?? { queue: [] };
    buf.queue.push(event);
    if (!buf.timer) {
      buf.timer = setTimeout(() => {
        const toSend = buf.queue.splice(0, buf.queue.length);
        for (const e of toSend) {
          this.gateway.broadcastToWorld(e.world_id, e);
          this.metrics.wsEvents.inc();
        }
        buf.timer = undefined;
      }, this.throttleMs);
    }
    this.worldBuffers.set(event.world_id, buf);
  }
}
