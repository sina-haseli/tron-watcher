import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { isTest } from '../app/base/constants';

export const TypeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: isTest ? process.env.DATABASE_TEST_NAME : process.env.DATABASE_NAME,
  synchronize: true,
  autoLoadEntities: true,
  logging: process.env.DATABASE_LOG === 'true',
  dropSchema: false,
  extra: {
    max: 40,
    connectionTimeoutMillis: 7000,
  },
};
