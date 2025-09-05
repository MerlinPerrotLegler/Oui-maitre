import { Module } from '@nestjs/common';
import { PlacesService } from './places.service';
import { PlacesController } from './places.controller';
import { WorldsPlacesController } from './worlds-places.controller';

@Module({
  providers: [PlacesService],
  controllers: [PlacesController, WorldsPlacesController],
})
export class PlacesModule {}

