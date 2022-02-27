import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TronService } from '../services/tron.service';
import { CreateTronDto } from '../dto/create-tron.dto';

@Controller('tron')
export class TronController {
  constructor(private readonly tronService: TronService) {}

  @Post('/')
  async createTron(@Body() tron: CreateTronDto) {
    return await this.tronService.createTron(tron);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tronService.findOne(+id);
  }
}
