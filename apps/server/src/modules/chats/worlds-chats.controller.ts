import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChatsService } from './chats.service';

@Controller('worlds/:worldId/chats')
export class WorldsChatsController {
  constructor(private readonly chats: ChatsService) {}

  @Get()
  list(@Param('worldId') worldId: string) { return this.chats.listByWorld(worldId); }

  @Post()
  create(
    @Param('worldId') worldId: string,
    @Body() body: { kind: 'dm'|'world'|'place'; place_id?: string; participants?: string[] },
  ) {
    return this.chats.create(worldId, body);
  }
}

