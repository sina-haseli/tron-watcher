import './plugins/dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { enableSwagger } from './plugins/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  };
  app.enableCors(options);
  enableSwagger(app);
  await app.listen(1337);
}
bootstrap();
