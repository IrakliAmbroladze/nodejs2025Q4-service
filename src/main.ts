import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { parse } from 'yamljs';
import { join } from 'path';
import * as fs from 'fs';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { LoggingService } from './logging/logging.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const loggingService = app.get(LoggingService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter(loggingService));

  const openapiPath = join(__dirname, '..', 'doc', 'api.yaml');
  const openapiDocument = parse(fs.readFileSync(openapiPath, 'utf8'));
  SwaggerModule.setup('doc', app, openapiDocument);

  process.on('uncaughtException', (error: Error) => {
    loggingService.error(
      `Uncaught Exception: ${error.message}`,
      error.stack,
      'UncaughtException',
    );
    process.exit(1);
  });

  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    loggingService.error(
      `Unhandled Rejection at: ${promise}, reason: ${reason}`,
      reason?.stack,
      'UnhandledRejection',
    );
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);
  loggingService.log(
    `Application is running on: http://localhost:${port}`,
    'Bootstrap',
  );
}

bootstrap();
