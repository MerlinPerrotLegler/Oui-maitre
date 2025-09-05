import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { PrismaService } from '../../prisma/prisma.service';
import { TokensService } from './tokens.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private tokens: TokensService) {}

  async register(input: { email: string; password: string; display_name?: string }) {
    const exists = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (exists) throw new BadRequestException('email_in_use');
    const password_hash = await argon2.hash(input.password, { type: argon2.argon2id });
    const user = await this.prisma.user.create({
      data: {
        email: input.email,
        passwordHash: password_hash,
        displayName: input.display_name ?? null,
      },
      select: { id: true, email: true, displayName: true },
    });
    const tokens = this.tokens.issue(user.id);
    return { user, ...tokens };
  }

  async login(input: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (!user || !user.passwordHash) throw new UnauthorizedException('invalid_credentials');
    const ok = await argon2.verify(user.passwordHash, input.password);
    if (!ok) throw new UnauthorizedException('invalid_credentials');
    const tokens = this.tokens.issue(user.id);
    return { user: { id: user.id, email: user.email, displayName: user.displayName }, ...tokens };
  }

  async refresh(input: { refresh_token: string }) {
    const payload = this.tokens.verifyRefresh(input.refresh_token);
    if (!payload?.sub) throw new UnauthorizedException('invalid_token');
    return this.tokens.issue(payload.sub);
  }

  async logout() {
    // Stateless JWT: no server-side invalidation by default.
    return { ok: true };
  }
}
