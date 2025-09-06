import { Body, Controller, Param, Post, BadRequestException } from '@nestjs/common';
import { OutboxService } from '../events/outbox.service';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('worlds/:worldId/sounds')
const rateMap = new Map<string, { ts: number; count: number }>();

export class SoundsController {
  constructor(private outbox: OutboxService, private prisma: PrismaService) {}

  @Post()
  async play(
    @Param('worldId') worldId: string,
    @Body() body: { url: string; volume?: number; targets?: { character_ids?: string[]; place_id?: string; group_id?: string; broadcast?: boolean } },
  ) {
    // Simple rate limit: max 5 requests per 10 seconds per world
    const now = Date.now();
    const slot = rateMap.get(worldId) || { ts: now, count: 0 };
    if (now - slot.ts > 10_000) { slot.ts = now; slot.count = 0; }
    slot.count += 1;
    rateMap.set(worldId, slot);
    if (slot.count > 5) throw new BadRequestException('rate_limited');

    await this.outbox.enqueue({ id: this.id(), type: 'sound.play', world_id: worldId, at: new Date().toISOString(), data: body });
    await this.prisma.historyEntry.create({ data: { worldId, entityType: 'world', entityId: worldId, action: 'sound.play', after: { url: body.url, targets: body.targets, volume: body.volume ?? 1 } } });
    return { ok: true };
  }

  private id() { return (Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2)).slice(0, 24); }
}
