import { Module } from '@nestjs/common';
import { TronService } from './services/tron.service';
import { TronController } from './controllers/tron.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TronRepository } from './repositories/tron.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TronRepository])],
  controllers: [TronController],
  providers: [TronService],
})
export class TronModule {}
