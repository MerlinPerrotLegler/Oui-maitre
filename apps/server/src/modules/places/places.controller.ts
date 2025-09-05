import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { PlacesService } from './places.service';

@Controller('places')
export class PlacesController {
  constructor(private readonly places: PlacesService) {}

  @Get(':id')
  get(@Param('id') id: string) {
    return this.places.get(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.places.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.places.remove(id);
  }
}

