import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { TokensService } from './tokens.service';
import { OauthService } from './oauth.service';
import { OauthController } from './oauth.controller';

@Module({
  imports: [PrismaModule],
  providers: [AuthService, TokensService, OauthService],
  controllers: [AuthController, OauthController],
})
export class AuthModule {}
