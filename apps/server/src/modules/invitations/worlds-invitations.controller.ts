import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { InvitationsService } from './invitations.service';

@Controller('worlds/:worldId/invitations')
export class WorldsInvitationsController {
  constructor(private readonly invitations: InvitationsService) {}

  @Get()
  list(@Param('worldId') worldId: string) {
    return this.invitations.listByWorld(worldId);
  }

  @Post()
  create(@Param('worldId') worldId: string, @Body() body: { expires_at?: string | null }) {
    return this.invitations.create(worldId, body);
  }
}

