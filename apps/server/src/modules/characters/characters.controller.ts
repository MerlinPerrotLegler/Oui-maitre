import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CharactersService } from './characters.service';

@Controller('characters')
export class CharactersController {
  constructor(private readonly characters: CharactersService) {}

  @Get()
  async list(@Query('world_id') worldId?: string) { return this.characters.list({ world_id: worldId }); }

  @Get(':id')
  async get(@Param('id') id: string) { return this.characters.get(id); }

  @Post()
  async create(@Body() body: any) { return this.characters.create(body); }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) { return this.characters.update(id, body); }
}
