import { Controller, Get, Param, Query, Post, Body } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OutboxService } from '../events/outbox.service';

@Controller('worlds/:worldId/history')
export class HistoryController {
  constructor(private prisma: PrismaService, private outbox: OutboxService) {}

  @Get()
  list(@Param('worldId') worldId: string, @Query('entity_type') et?: string, @Query('entity_id') eid?: string) {
    return this.prisma.historyEntry.findMany({
      where: { worldId, ...(et ? { entityType: et } : {}), ...(eid ? { entityId: eid } : {}) },
      orderBy: { at: 'desc' },
    });
  }

  @Post('/rollback')
  async rollback(@Param('worldId') worldId: string, @Body() body: { at: string; reason?: string }) {
    // Stub: record a rollback request and emit event; no actual state restore implemented yet.
    await this.prisma.historyEntry.create({
      data: { worldId, entityType: 'world', entityId: worldId, action: 'rollback', metadata: { target_at: body.at, reason: body.reason ?? null } },
    });
    await this.outbox.enqueue({ id: this.id(), type: 'world.rolled_back', world_id: worldId, at: new Date().toISOString(), data: { target_at: body.at } });
    return { ok: true };
  }

  private id() { return (Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2)).slice(0, 24); }
}

