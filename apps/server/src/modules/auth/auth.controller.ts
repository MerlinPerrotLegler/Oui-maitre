import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  async register() { return {}; }

  @Post('login')
  async login() { return {}; }

  @Post('refresh')
  async refresh() { return {}; }

  @Post('logout')
  async logout() { return {}; }
}

