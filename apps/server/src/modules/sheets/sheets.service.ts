import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SheetsService {
  constructor(private prisma: PrismaService) {}

  async list(filter?: { is_template?: boolean }) {
    return this.prisma.sheet.findMany({
      where: {
        ...(filter?.is_template !== undefined ? { isTemplate: filter.is_template } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async listByWorld(worldId: string, filter?: { is_template?: boolean }) {
    return this.prisma.sheet.findMany({
      where: {
        worldId,
        ...(filter?.is_template !== undefined ? { isTemplate: filter.is_template } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(input: {
    world_id: string;
    is_template: boolean;
    name: string;
    attributes?: any;
    capacities?: any;
    purse_gold?: number;
    purse_silver?: number;
    purse_copper?: number;
    vision?: number;
    avatar_url?: string;
  }) {
    return this.prisma.sheet.create({
      data: {
        worldId: input.world_id,
        isTemplate: input.is_template,
        name: input.name,
        attributes: input.attributes ?? null,
        capacities: input.capacities ?? null,
        purseGold: input.purse_gold ?? 0,
        purseSilver: input.purse_silver ?? 0,
        purseCopper: input.purse_copper ?? 0,
        vision: input.vision ?? 0,
        avatarUrl: input.avatar_url ?? null,
      },
    });
  }

  async get(id: string) {
    return this.prisma.sheet.findUnique({ where: { id } });
  }

  async update(id: string, input: any) {
    return this.prisma.sheet.update({
      where: { id },
      data: {
        name: input.name,
        attributes: input.attributes,
        capacities: input.capacities,
        purseGold: input.purse_gold,
        purseSilver: input.purse_silver,
        purseCopper: input.purse_copper,
        vision: input.vision,
        avatarUrl: input.avatar_url,
      },
    });
  }

  async duplicate(id: string) {
    const src = await this.prisma.sheet.findUnique({ where: { id } });
    if (!src) return null;
    return this.prisma.sheet.create({
      data: {
        worldId: src.worldId,
        isTemplate: false,
        templateSourceId: src.id,
        name: `${src.name} (copie)`,
        attributes: src.attributes,
        capacities: src.capacities,
        purseGold: src.purseGold,
        purseSilver: src.purseSilver,
        purseCopper: src.purseCopper,
        vision: src.vision,
        avatarUrl: src.avatarUrl,
      },
    });
  }
}
