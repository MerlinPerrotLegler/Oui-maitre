import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SnapshotService {
  constructor(private prisma: PrismaService) {}

  async create(worldId: string) {
    const [world, places, sheets, characters, items, groups, groupMembers] = await Promise.all([
      this.prisma.world.findUnique({ where: { id: worldId } }),
      this.prisma.place.findMany({ where: { worldId } }),
      this.prisma.sheet.findMany({ where: { worldId } }),
      this.prisma.character.findMany({ where: { worldId } }),
      this.prisma.item.findMany({ where: { worldId } }),
      this.prisma.group.findMany({ where: { worldId } }),
      this.prisma.groupMember.findMany({}),
    ]);
    const snapshot = { world, places, sheets, characters, items, groups, groupMembers };
    return this.prisma.worldSnapshot.create({ data: { worldId, snapshot } });
  }
}

