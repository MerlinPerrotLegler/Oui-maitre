import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';

import { AuthModule } from './auth/auth.module';
import { WorldsModule } from './worlds/worlds.module';
import { SheetsModule } from './sheets/sheets.module';
import { CharactersModule } from './characters/characters.module';
import { ItemsModule } from './items/items.module';
import { PlacesModule } from './places/places.module';
import { GroupsModule } from './groups/groups.module';

@Module({
  imports: [PrismaModule, AuthModule, WorldsModule, PlacesModule, GroupsModule, SheetsModule, CharactersModule, ItemsModule],
})
export class AppModule {}
