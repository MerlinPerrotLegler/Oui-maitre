import { Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';

type TokenPair = {
  access_token: string;
  refresh_token: string;
  access_expires_in: number;
  refresh_expires_in: number;
};

@Injectable()
export class TokensService {
  private accessSecret = process.env.JWT_ACCESS_SECRET || 'dev_access_secret_change_me';
  private refreshSecret = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_change_me';
  private accessTtl = process.env.JWT_ACCESS_TTL || '900s';
  private refreshTtl = process.env.JWT_REFRESH_TTL || '14d';

  issue(userId: string): TokenPair {
    const access_token = jwt.sign({ sub: userId }, this.accessSecret, { expiresIn: this.accessTtl });
    const refresh_token = jwt.sign({ sub: userId, typ: 'refresh' }, this.refreshSecret, {
      expiresIn: this.refreshTtl,
    });
    return {
      access_token,
      refresh_token,
      access_expires_in: this.parseExpirySeconds(this.accessTtl),
      refresh_expires_in: this.parseExpirySeconds(this.refreshTtl),
    };
  }

  verifyRefresh(token: string): any {
    try {
      return jwt.verify(token, this.refreshSecret);
    } catch {
      return null;
    }
  }

  private parseExpirySeconds(spec: string): number {
    // Supports formats like '900s', '15m', '14d'
    const m = spec.match(/^(\d+)([smhd])$/);
    if (!m) return 0;
    const value = parseInt(m[1], 10);
    const unit = m[2];
    const mul = unit === 's' ? 1 : unit === 'm' ? 60 : unit === 'h' ? 3600 : 86400;
    return value * mul;
  }
}

