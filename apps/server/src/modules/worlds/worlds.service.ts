import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WorldsService {
  constructor(private prisma: PrismaService) {}

  async list() {
    return this.prisma.world.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async get(id: string) {
    return this.prisma.world.findUnique({ where: { id } });
  }

  async create(input: { name: string; owner_user_id?: string }) {
    return this.prisma.world.create({
      data: { name: input.name, ownerUserId: input.owner_user_id || '' },
    });
  }

  async update(id: string, input: { name?: string }) {
    return this.prisma.world.update({ where: { id }, data: { name: input.name } });
  }

  async remove(id: string) {
    return this.prisma.world.delete({ where: { id } });
  }
}
