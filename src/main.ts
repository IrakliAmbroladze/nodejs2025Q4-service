import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { parse } from 'yamljs';
import { join } from 'path';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const openapiPath = join(__dirname, '..', 'doc', 'api.yaml');
  const openapiDocument = parse(fs.readFileSync(openapiPath, 'utf8'));
  SwaggerModule.setup('doc', app, openapiDocument);
  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
