import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { validateEnvironment } from './config/env.validation';

async function bootstrap() {
  validateEnvironment();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port);
}
bootstrap();
