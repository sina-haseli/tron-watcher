import { Module } from '@nestjs/common';
import { TronModule } from './app/tron/tron.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [TypeOrmModule.forRoot(TypeOrmConfig), TronModule],
})
export class AppModule {}
