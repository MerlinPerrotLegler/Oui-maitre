import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PlacesService } from './places.service';

@Controller('worlds/:worldId/places')
export class WorldsPlacesController {
  constructor(private readonly places: PlacesService) {}

  @Get()
  list(@Param('worldId') worldId: string) {
    return this.places.listByWorld(worldId);
  }

  @Post()
  create(@Param('worldId') worldId: string, @Body() body: any) {
    return this.places.create(worldId, body);
  }
}

