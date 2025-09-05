import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  listByWorld(worldId: string) {
    return this.prisma.group.findMany({ where: { worldId }, orderBy: { createdAt: 'desc' } });
  }

  get(id: string) {
    return this.prisma.group.findUnique({ where: { id } });
  }

  create(worldId: string, data: { name: string }) {
    return this.prisma.group.create({ data: { worldId, name: data.name } });
  }

  remove(id: string) {
    return this.prisma.group.delete({ where: { id } });
  }

  async addMember(groupId: string, characterId: string) {
    return this.prisma.groupMember.create({ data: { groupId, characterId } });
  }

  async removeMember(groupId: string, characterId: string) {
    return this.prisma.groupMember.delete({ where: { groupId_characterId: { groupId, characterId } } });
  }
}

