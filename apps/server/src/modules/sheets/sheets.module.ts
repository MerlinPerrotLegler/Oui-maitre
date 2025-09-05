import { Module } from '@nestjs/common';
import { SheetsService } from './sheets.service';
import { SheetsController } from './sheets.controller';
import { WorldsSheetsController } from './worlds-sheets.controller';

@Module({
  providers: [SheetsService],
  controllers: [SheetsController, WorldsSheetsController],
})
export class SheetsModule {}
