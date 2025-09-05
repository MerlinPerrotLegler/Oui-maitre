import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { WorldsService } from './worlds.service';

@Controller('worlds')
export class WorldsController {
  constructor(private readonly worlds: WorldsService) {}

  @Get()
  async list() { return this.worlds.list(); }

  @Get(':id')
  async get(@Param('id') id: string) { return this.worlds.get(id); }

  @Post()
  async create(@Body() body: any) { return this.worlds.create(body); }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) { return this.worlds.update(id, body); }

  @Delete(':id')
  async remove(@Param('id') id: string) { return this.worlds.remove(id); }
}
