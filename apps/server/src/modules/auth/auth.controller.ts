import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string; display_name?: string }) {
    return this.auth.register(body);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.auth.login(body);
  }

  @Post('refresh')
  async refresh(@Body() body: { refresh_token: string }) { return this.auth.refresh(body); }

  @Post('logout')
  async logout() { return this.auth.logout(); }
}
