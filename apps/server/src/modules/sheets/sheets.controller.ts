import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { SheetsService } from './sheets.service';

@Controller('sheets')
export class SheetsController {
  constructor(private readonly sheets: SheetsService) {}

  @Get()
  async list(@Query('is_template') isTemplate?: string, @Query('ai') ai?: string) {
    const filter = isTemplate === undefined ? {} : { is_template: isTemplate === 'true' };
    const list = await this.sheets.list(filter as any);
    if (ai === '1') {
      const { aiSheetShape } = await import('../ai/ai.util');
      return list.map((s: any) => ({ ...s, ...aiSheetShape(s) }));
    }
    return list;
  }

  @Get(':id')
  async get(@Param('id') id: string, @Query('ai') ai?: string) {
    const sheet = await this.sheets.get(id);
    if (!sheet) return null;
    if (ai === '1') {
      const { aiSheetShape } = await import('../ai/ai.util');
      return { ...sheet, ...aiSheetShape(sheet) };
    }
    return sheet;
  }

  @Post()
  async create(@Body() body: any) { return this.sheets.create(body); }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) { return this.sheets.update(id, body); }

  @Post(':id/duplicate')
  async duplicate(@Param('id') id: string) { return this.sheets.duplicate(id); }
}
