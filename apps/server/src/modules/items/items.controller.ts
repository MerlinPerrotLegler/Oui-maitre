import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ItemsService } from './items.service';

@Controller('items')
export class ItemsController {
  constructor(private readonly items: ItemsService) {}

  @Get()
  async list(@Query('world_id') worldId?: string, @Query('vision') vision?: string) {
    const v = vision !== undefined ? Number(vision) : undefined;
    return this.items.list({ world_id: worldId, vision: typeof v === 'number' && !isNaN(v) ? v : undefined });
  }

  @Get(':id')
  async get(@Param('id') id: string) { return this.items.get(id); }

  @Post()
  async create(@Body() body: any) { return this.items.create(body); }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) { return this.items.update(id, body); }

  @Post(':id/open')
  async open(@Param('id') id: string) { return { id, is_open: true }; }
}
