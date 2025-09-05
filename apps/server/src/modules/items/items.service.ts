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
}
