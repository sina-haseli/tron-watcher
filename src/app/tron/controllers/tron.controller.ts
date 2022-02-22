import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TronService } from '../services/tron.service';
import { CreateTronDto } from '../dto/create-tron.dto';
import { UpdateTronDto } from '../dto/update-tron.dto';

@Controller('tron')
export class TronController {
  constructor(private readonly tronService: TronService) {}

  @Post()
  create(@Body() createTronDto: CreateTronDto) {
    return this.tronService.create(createTronDto);
  }

  @Get()
  findAll() {
    return this.tronService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tronService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTronDto: UpdateTronDto) {
    return this.tronService.update(+id, updateTronDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tronService.remove(+id);
  }
}
