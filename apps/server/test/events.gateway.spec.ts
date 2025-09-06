import { describe, it, expect, vi } from 'vitest';
import { EventsService } from '../src/modules/events/events.service';

describe('EventsService throttling', () => {
  it('buffers events and emits later', async () => {
    const svc = new EventsService({
      broadcastToWorld: vi.fn(),
    } as any);
    // @ts-ignore access private
    svc.throttleMs = 10;
    svc.emit({ id: '1', type: 't', world_id: 'w', at: new Date().toISOString(), data: {} });
    svc.emit({ id: '2', type: 't', world_id: 'w', at: new Date().toISOString(), data: {} });
    // Immediately, gateway not called yet
    // @ts-ignore
    expect(svc.gateway.broadcastToWorld).not.toHaveBeenCalled();
    await new Promise((r) => setTimeout(r, 15));
    // @ts-ignore
    expect(svc.gateway.broadcastToWorld).toHaveBeenCalledTimes(2);
  });
});

