import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { WorldsGroupsController } from './worlds-groups.controller';

@Module({
  providers: [GroupsService],
  controllers: [GroupsController, WorldsGroupsController],
})
export class GroupsModule {}

