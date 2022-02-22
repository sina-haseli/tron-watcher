import { Module } from '@nestjs/common';
import { TronService } from './services/tron.service';
import { TronController } from './controllers/tron.controller';

@Module({
  controllers: [TronController],
  providers: [TronService],
})
export class TronModule {}
