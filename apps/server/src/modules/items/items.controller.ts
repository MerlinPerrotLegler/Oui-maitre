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
  async get(@Param('id') id: string, @Query('include') include?: string) {
    const item = await this.items.get(id);
    if (!item) return null;
    if (include === 'contents' && item.type === 'container' && item.isOpen) {
      const contents = await this.items.listContents(id);
      return { ...item, contents };
    }
    return item;
  }

  @Post()
  async create(@Body() body: any) { return this.items.create(body); }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) { return this.items.update(id, body); }

  @Post(':id/open')
  async open(@Param('id') id: string) {
    const item = await this.items.get(id);
    if (!item) return { error: 'not_found', message: 'Item not found' };
    if (item.type !== 'container') return { error: 'not_container', message: 'Item is not a container' };
    if (item.isLockable && item.isLocked) return { error: 'container_locked', message: 'Container is locked' };
    if (item.isOpen) return { id: item.id, is_open: true };
    const updated = await this.items.update(id, { is_open: true });
    return { id: updated.id, is_open: true };
  }
}
