import { Module } from '@nestjs/common';
import { WorldsService } from './worlds.service';
import { WorldsController } from './worlds.controller';

@Module({
  providers: [WorldsService],
  controllers: [WorldsController],
})
export class WorldsModule {}

