import { Module } from '@nestjs/common';
import { TronModule } from './app/tron/tron.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from './config/typeorm.config';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [TypeOrmModule.forRoot(TypeOrmConfig), RedisModule, TronModule],
})
export class AppModule {}
