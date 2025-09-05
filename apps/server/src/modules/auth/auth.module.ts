import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { TokensService } from './tokens.service';

@Module({
  imports: [PrismaModule],
  providers: [AuthService, TokensService],
  controllers: [AuthController],
})
export class AuthModule {}
