import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import 'multer';
import { json } from 'express';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  app.use(json({ limit: '50mb' }));

  const browserUrl = process.env.BROWSER_URL?.replace(/\/$/, '');

  const allowedOrigins = [
    browserUrl,
    'https://accounts.google.com',
    'https://oauth2.googleapis.com',
  ];

  logger.log(`Allowed origins: ${allowedOrigins}`);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
