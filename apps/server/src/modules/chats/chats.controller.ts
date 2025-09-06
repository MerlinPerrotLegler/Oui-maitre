import { Body, Controller, Get, Param, Patch, Post, Delete, Headers } from '@nestjs/common';
import { ChatsService } from './chats.service';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chats: ChatsService) {}

  @Get(':id')
  get(@Param('id') id: string, @Headers('x-actor-role') role?: string, @Headers('x-actor-character-id') characterId?: string) {
    return this.chats.get(id, { role, characterId });
  }

  @Post(':id/messages')
  createMessage(@Param('id') id: string, @Body() body: { from_character_id: string; content: string; to_character_id?: string }) {
    return this.chats.createMessage(id, body.from_character_id, body.content, body.to_character_id);
  }

  @Patch(':id/messages/:messageId')
  editMessage(@Param('id') id: string, @Param('messageId') messageId: string, @Body() body: { content: string }, @Headers('x-actor-role') role?: string, @Headers('x-actor-character-id') characterId?: string) {
    return this.chats.editMessage(id, messageId, body.content, { role, characterId });
  }

  @Delete(':id/messages/:messageId')
  deleteMessage(@Param('id') id: string, @Param('messageId') messageId: string, @Headers('x-actor-role') role?: string, @Headers('x-actor-character-id') characterId?: string) {
    return this.chats.deleteMessage(id, messageId, { role, characterId });
  }
}
