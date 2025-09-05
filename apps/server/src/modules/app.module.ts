import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';

import { AuthModule } from './auth/auth.module';
import { WorldsModule } from './worlds/worlds.module';
import { SheetsModule } from './sheets/sheets.module';
import { CharactersModule } from './characters/characters.module';
import { ItemsModule } from './items/items.module';

@Module({
  imports: [PrismaModule, AuthModule, WorldsModule, SheetsModule, CharactersModule, ItemsModule],
})
export class AppModule {}
