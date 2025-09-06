import { Body, Controller, Headers, Post } from '@nestjs/common';
import { TransfersService } from './transfers.service';

@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfers: TransfersService) {}

  @Post()
  transfer(@Body() body: any, @Headers('x-actor-role') role?: string, @Headers('x-actor-character-id') characterId?: string) {
    return this.transfers.transfer({ ...body, actor: { role, characterId } });
  }
}
