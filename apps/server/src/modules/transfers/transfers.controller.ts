import { Body, Controller, Post } from '@nestjs/common';
import { TransfersService } from './transfers.service';

@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfers: TransfersService) {}

  @Post()
  transfer(@Body() body: any) {
    return this.transfers.transfer(body);
  }
}

