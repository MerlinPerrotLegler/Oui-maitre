import { Module } from '@nestjs/common';
import { SoundsController } from './sounds.controller';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [EventsModule],
  controllers: [SoundsController],
})
export class SoundsModule {}

