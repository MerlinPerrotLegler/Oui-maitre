import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { WorldsChatsController } from './worlds-chats.controller';
import { ChatsController } from './chats.controller';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [EventsModule],
  providers: [ChatsService],
  controllers: [WorldsChatsController, ChatsController],
})
export class ChatsModule {}

