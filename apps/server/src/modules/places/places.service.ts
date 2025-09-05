import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PlacesService {
  constructor(private prisma: PrismaService) {}

  listByWorld(worldId: string) {
    return this.prisma.place.findMany({ where: { worldId }, orderBy: { createdAt: 'desc' } });
  }

  get(id: string) {
    return this.prisma.place.findUnique({ where: { id } });
  }

  create(worldId: string, data: { name: string; attributes?: any; avatar_url?: string }) {
    return this.prisma.place.create({
      data: { worldId, name: data.name, attributes: data.attributes ?? null, avatarUrl: data.avatar_url ?? null },
    });
  }

  update(id: string, data: { name?: string; attributes?: any; avatar_url?: string }) {
    return this.prisma.place.update({
      where: { id },
      data: { name: data.name, attributes: data.attributes, avatarUrl: data.avatar_url },
    });
  }

  remove(id: string) {
    return this.prisma.place.delete({ where: { id } });
  }
}

