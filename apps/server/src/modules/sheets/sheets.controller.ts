import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { SheetsService } from './sheets.service';

@Controller('sheets')
export class SheetsController {
  constructor(private readonly sheets: SheetsService) {}

  @Get()
  async list(@Query('is_template') isTemplate?: string) {
    if (isTemplate === 'true') return this.sheets.listTemplates();
    return [];
  }

  @Get(':id')
  async get(@Param('id') id: string) { return this.sheets.get(id); }

  @Post()
  async create(@Body() body: any) { return this.sheets.create(body); }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) { return this.sheets.update(id, body); }

  @Post(':id/duplicate')
  async duplicate(@Param('id') id: string) { return this.sheets.duplicate(id); }
}

