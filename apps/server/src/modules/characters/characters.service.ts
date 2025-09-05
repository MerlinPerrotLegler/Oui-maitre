import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CharactersService {
  constructor(private prisma: PrismaService) {}

  async list(filter?: { world_id?: string }) {
    return this.prisma.character.findMany({
      where: {
        ...(filter?.world_id ? { worldId: filter.world_id } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async get(id: string) { return this.prisma.character.findUnique({ where: { id } }); }

  async create(input: {
    world_id: string;
    sheet_id: string;
    type: 'PC' | 'NPC';
    user_id?: string | null;
    current_place_id: string;
  }) {
    return this.prisma.character.create({
      data: {
        worldId: input.world_id,
        sheetId: input.sheet_id,
        type: input.type as any,
        userId: input.user_id ?? null,
        currentPlaceId: input.current_place_id,
      },
    });
  }

  async update(id: string, input: any) {
    return this.prisma.character.update({
      where: { id },
      data: {
        currentPlaceId: input.current_place_id,
        rightHandItemId: input.right_hand_item_id,
        leftHandItemId: input.left_hand_item_id,
      },
    });
  }
}
