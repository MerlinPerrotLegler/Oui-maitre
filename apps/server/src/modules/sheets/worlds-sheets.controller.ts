import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { SheetsService } from './sheets.service';

@Controller('worlds/:worldId/sheets')
export class WorldsSheetsController {
  constructor(private readonly sheets: SheetsService) {}

  @Get()
  list(
    @Param('worldId') worldId: string,
    @Query('is_template') isTemplate?: string,
  ) {
    const filter = isTemplate === undefined ? {} : { is_template: isTemplate === 'true' };
    return this.sheets.listByWorld(worldId, filter as any);
  }

  @Post()
  create(@Param('worldId') worldId: string, @Body() body: any) {
    return this.sheets.create({ world_id: worldId, ...body });
  }
}

