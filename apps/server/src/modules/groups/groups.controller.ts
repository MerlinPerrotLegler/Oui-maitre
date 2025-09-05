import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { GroupsService } from './groups.service';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groups: GroupsService) {}

  @Get(':id')
  get(@Param('id') id: string) { return this.groups.get(id); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.groups.remove(id); }

  @Post(':id/members')
  addMember(@Param('id') id: string, @Body() body: { character_id: string }) {
    return this.groups.addMember(id, body.character_id);
  }

  @Delete(':id/members/:characterId')
  removeMember(@Param('id') id: string, @Param('characterId') characterId: string) {
    return this.groups.removeMember(id, characterId);
  }
}

