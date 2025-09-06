import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';

import { AuthModule } from './auth/auth.module';
import { WorldsModule } from './worlds/worlds.module';
import { SheetsModule } from './sheets/sheets.module';
import { CharactersModule } from './characters/characters.module';
import { ItemsModule } from './items/items.module';
import { PlacesModule } from './places/places.module';
import { GroupsModule } from './groups/groups.module';
import { InvitationsModule } from './invitations/invitations.module';
import { TransfersModule } from './transfers/transfers.module';
import { EventsModule } from './events/events.module';
import { ChatsModule } from './chats/chats.module';
import { HistoryModule } from './history/history.module';
import { SoundsModule } from './sounds/sounds.module';
import { AiModule } from './ai/ai.module';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [PrismaModule, AuthModule, WorldsModule, PlacesModule, GroupsModule, InvitationsModule, MetricsModule, EventsModule, TransfersModule, ChatsModule, HistoryModule, SoundsModule, AiModule, SheetsModule, CharactersModule, ItemsModule],
})
export class AppModule {}
