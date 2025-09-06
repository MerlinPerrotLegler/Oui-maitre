import { Body, Controller, Param, Post } from '@nestjs/common';
import { OutboxService } from '../events/outbox.service';

@Controller('worlds/:worldId/sounds')
export class SoundsController {
  constructor(private outbox: OutboxService) {}

  @Post()
  async play(
    @Param('worldId') worldId: string,
    @Body() body: { url: string; volume?: number; targets?: { character_ids?: string[]; place_id?: string; group_id?: string; broadcast?: boolean } },
  ) {
    await this.outbox.enqueue({ id: this.id(), type: 'sound.play', world_id: worldId, at: new Date().toISOString(), data: body });
    return { ok: true };
  }

  private id() { return (Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2)).slice(0, 24); }
}

