import { Module } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { WorldsInvitationsController } from './worlds-invitations.controller';
import { InvitationsController } from './invitations.controller';

@Module({
  providers: [InvitationsService],
  controllers: [WorldsInvitationsController, InvitationsController],
})
export class InvitationsModule {}

