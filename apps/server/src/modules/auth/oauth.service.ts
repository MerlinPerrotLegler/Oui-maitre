import { Injectable } from '@nestjs/common';
import { Issuer, Client, generators } from 'openid-client';

@Injectable()
export class OauthService {
  private clientPromise: Promise<Client> | null = null;

  private async getClient(): Promise<Client> {
    if (!this.clientPromise) {
      this.clientPromise = (async () => {
        const issuer = await Issuer.discover('https://accounts.google.com');
        return new issuer.Client({
          client_id: process.env.GOOGLE_CLIENT_ID || '',
          client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
          redirect_uris: [this.redirectUri()],
          response_types: ['code'],
        });
      })();
    }
    return this.clientPromise;
  }

  private redirectUri(): string {
    const base = process.env.OAUTH_BASE_URL || 'http://localhost:3000';
    return `${base.replace(/\/$/, '')}/oauth/google/callback`;
  }

  async authorizationUrl(state?: string): Promise<{ url: string; state: string }> {
    const client = await this.getClient();
    const realState = state || generators.state();
    const url = client.authorizationUrl({
      scope: 'openid email profile',
      state: realState,
      redirect_uri: this.redirectUri(),
    });
    return { url, state: realState };
  }

  async callback(params: { code: string; state?: string }) {
    const client = await this.getClient();
    const tokenSet = await client.callback(this.redirectUri(), params, { state: params.state });
    const userinfo = await client.userinfo(tokenSet);
    return { tokenSet, userinfo };
  }
}

