import { Controller, Sse } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { EventsService } from './events.service';

@Controller('events')
export class SseController {
  constructor(private readonly events: EventsService) {}

  @Sse()
  sse() {
    return this.events.stream().pipe(map((e) => ({ data: e })));
  }
}

