import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GroupsService } from './groups.service';

@Controller('worlds/:worldId/groups')
export class WorldsGroupsController {
  constructor(private readonly groups: GroupsService) {}

  @Get()
  list(@Param('worldId') worldId: string) { return this.groups.listByWorld(worldId); }

  @Post()
  create(@Param('worldId') worldId: string, @Body() body: { name: string }) {
    return this.groups.create(worldId, body);
  }
}

