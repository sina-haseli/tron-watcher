import { Controller, Get, Param } from '@nestjs/common';
import { TronService } from '../services/tron.service';

@Controller('tron')
export class TronController {
  constructor(private readonly tronService: TronService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tronService.findOne(+id);
  }
}
