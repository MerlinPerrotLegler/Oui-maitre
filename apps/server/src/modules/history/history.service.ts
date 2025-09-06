import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class HistoryService {
  constructor(private prisma: PrismaService) {}

  async record(entry: {
    world_id: string;
    entity_type: string;
    entity_id: string;
    action: string;
    before?: any;
    after?: any;
    actor_user_id?: string | null;
    source?: 'ui'|'api'|'system';
    request_id?: string | null;
    metadata?: any;
  }) {
    return this.prisma.historyEntry.create({
      data: {
        worldId: entry.world_id,
        entityType: entry.entity_type,
        entityId: entry.entity_id,
        action: entry.action,
        actorUserId: entry.actor_user_id ?? null,
        source: entry.source ?? 'api',
        requestId: entry.request_id ?? null,
        before: entry.before ?? null,
        after: entry.after ?? null,
        metadata: entry.metadata ?? null,
      },
    });
  }
}

