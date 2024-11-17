import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import 'multer';
import { json } from 'express';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: '50mb' }));

  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? ['https://your-frontend-url.onrender.com']
        : true,
    credentials: true,
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
