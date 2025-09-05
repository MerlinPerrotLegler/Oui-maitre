import { Controller, Param, Post } from '@nestjs/common';
import { InvitationsService } from './invitations.service';

@Controller('invitations')
export class InvitationsController {
  constructor(private readonly invitations: InvitationsService) {}

  @Post(':token/accept')
  accept(@Param('token') token: string) {
    return this.invitations.accept(token);
  }
}

