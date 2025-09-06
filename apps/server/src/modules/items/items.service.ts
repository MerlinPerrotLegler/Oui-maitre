import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService) {}

  async list(filter?: { world_id?: string }) {
    return this.prisma.item.findMany({
      where: {
        ...(filter?.world_id ? { worldId: filter.world_id } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async get(id: string) {
    return this.prisma.item.findUnique({ where: { id } });
  }

  async create(input: {
    world_id: string;
    name: string;
    description?: string;
    type?: 'generic' | 'weapon' | 'armor' | 'container';
    metadata?: any;
    capacities?: any;
    visibility?: number;
    avatar_url?: string;
  }) {
    this.validateByType(input.type ?? 'generic', input.metadata);
    return this.prisma.item.create({
      data: {
        worldId: input.world_id,
        name: input.name,
        description: input.description ?? null,
        type: (input.type ?? 'generic') as any,
        metadata: input.metadata ?? null,
        capacities: input.capacities ?? null,
        visibility: input.visibility ?? 0,
        avatarUrl: input.avatar_url ?? null,
        holderType: 'world' as any,
        holderId: input.world_id,
      },
    });
  }

  async update(id: string, input: any) {
    if (input?.type || input?.metadata) {
      const item = await this.prisma.item.findUnique({ where: { id } });
      const nextType = (input?.type ?? item?.type ?? 'generic') as any;
      const nextMeta = input?.metadata ?? item?.metadata ?? null;
      this.validateByType(nextType, nextMeta);
    }
    return this.prisma.item.update({
      where: { id },
      data: {
        name: input.name,
        description: input.description,
        type: input.type,
        metadata: input.metadata,
        capacities: input.capacities,
        visibility: input.visibility,
        avatarUrl: input.avatar_url,
      },
    });
  }

  private validateByType(type: 'generic'|'weapon'|'armor'|'container', metadata: any) {
    if (type === 'weapon') {
      if (!metadata || typeof metadata.degats_base !== 'number' || typeof metadata.degats_des !== 'string') {
        throw new Error('invalid_metadata_weapon');
      }
    }
    if (type === 'armor') {
      if (!metadata || typeof metadata.defense !== 'number' || typeof metadata.malus !== 'number') {
        throw new Error('invalid_metadata_armor');
      }
    }
    // container: optional metadata
  }
}
