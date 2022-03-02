import { Body, Get, Param, Post } from '@nestjs/common';
import { TronService } from '../services/tron.service';
import { CreateTronDto } from '../dto/create-tron.dto';
import { BusinessController } from '../../common/decorator/business-controller.decorator';

@BusinessController('/tron', 'Wallets')
export class TronController {
  constructor(private readonly tronService: TronService) {}

  @Post('/')
  async createTron(@Body() tron: CreateTronDto) {
    return await this.tronService.createTron(tron);
  }

  @Get('/user/:userId')
  async getTron(@Param('userId') userId: number) {
    return await this.tronService.getTron(userId);
  }

  @Get('/wallet/:walletAddress')
  async getTronByWalletAddress(@Param('walletAddress') walletAddress: string) {
    return await this.tronService.getTronByWalletAddress(walletAddress);
  }
}
