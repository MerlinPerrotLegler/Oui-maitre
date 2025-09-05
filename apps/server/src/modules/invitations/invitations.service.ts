import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import crypto from 'crypto';

@Injectable()
export class InvitationsService {
  constructor(private prisma: PrismaService) {}

  async listByWorld(worldId: string) {
    return this.prisma.invitation.findMany({ where: { worldId }, orderBy: { createdAt: 'desc' } });
  }

  async create(worldId: string, input?: { expires_at?: string | null }) {
    const token = crypto.randomBytes(24).toString('base64url');
    const expiresAt = input?.expires_at ? new Date(input.expires_at) : null;
    return this.prisma.invitation.create({
      data: { worldId, token, expiresAt: expiresAt ?? undefined },
    });
  }

  async revoke(id: string) {
    return this.prisma.invitation.update({ where: { id }, data: { status: 'revoked', revokedAt: new Date() } as any });
  }

  async accept(token: string) {
    const inv = await this.prisma.invitation.findUnique({ where: { token } });
    if (!inv) throw new BadRequestException('invalid_token');
    if (inv.status !== 'active') throw new BadRequestException('invitation_not_active');
    if (inv.expiresAt && inv.expiresAt.getTime() < Date.now()) throw new BadRequestException('invitation_expired');

    const updated = await this.prisma.invitation.update({
      where: { id: inv.id },
      data: { status: 'used', usedAt: new Date() } as any,
    });
    return { ok: true, world_id: updated.worldId };
  }
}

