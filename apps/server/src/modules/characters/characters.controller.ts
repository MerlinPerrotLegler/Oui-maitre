import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CharactersService } from './characters.service';

@Controller('characters')
export class CharactersController {
  constructor(private readonly characters: CharactersService) {}

  @Get()
  async list() { return this.characters.list(); }

  @Get(':id')
  async get(@Param('id') id: string) { return this.characters.get(id); }

  @Post()
  async create(@Body() body: any) { return this.characters.create(body); }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) { return this.characters.update(id, body); }
}

