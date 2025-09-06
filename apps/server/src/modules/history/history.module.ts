import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { SnapshotService } from './snapshot.service';

@Module({
  providers: [HistoryService, SnapshotService],
  controllers: [HistoryController],
  exports: [HistoryService, SnapshotService],
})
export class HistoryModule {}
