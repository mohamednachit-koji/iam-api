import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import helmet from 'helmet';
import { RootModule } from './RootModule';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(RootModule);
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.setGlobalPrefix('api');
  app.set('trust proxy', 1);
  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Demo Application')
    .setDescription('Demo API Application')
    .setVersion('v3')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/swagger', app, document);
  // Validation
  app.useGlobalPipes(new ValidationPipe());
  app.use(helmet());
  // Configuration
  const configService: ConfigService = app.get(ConfigService);
  const port = configService.get<number>('SERVER_PORT');
  await app.listen(port, () =>
    app.get(Logger).log(`App started on port ${port}`),
  );
}

bootstrap();
