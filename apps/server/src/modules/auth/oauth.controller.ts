import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { OauthService } from './oauth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { TokensService } from './tokens.service';

@Controller('oauth/google')
export class OauthController {
  constructor(
    private readonly oauth: OauthService,
    private readonly prisma: PrismaService,
    private readonly tokens: TokensService,
  ) {}

  @Get('start')
  async start(@Res() res: Response) {
    const { url } = await this.oauth.authorizationUrl();
    return res.redirect(url);
  }

  @Get('callback')
  async callback(
    @Query('code') code: string,
    @Query('state') state: string | undefined,
    @Res() res: Response,
  ) {
    const { userinfo } = await this.oauth.callback({ code, state });
    const email = (userinfo as any).email as string | undefined;
    const sub = (userinfo as any).sub as string | undefined;
    const name = ((userinfo as any).name as string | undefined) || undefined;

    if (!email || !sub) {
      return res.status(400).json({ error: 'oauth_profile_incomplete' });
    }

    // Link or create user
    let user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          oauthProvider: 'google',
          oauthSub: sub,
          displayName: name ?? null,
        },
      });
    } else if (!user.oauthProvider || !user.oauthSub) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { oauthProvider: 'google', oauthSub: sub },
      });
    }

    const tokens = this.tokens.issue(user.id);

    // For now return JSON; in a real app redirect with tokens in a cookie or URL fragment.
    return res.json({ user: { id: user.id, email: user.email, displayName: user.displayName }, ...tokens });
  }
}

