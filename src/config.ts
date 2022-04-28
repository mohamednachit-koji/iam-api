import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import * as Joi from 'joi';
import * as winston from 'winston';
import { join } from 'path';

export const envConfig = {
  validationSchema: Joi.object({
    NODE_ENV: Joi.string().valid('dev', 'prod', 'test').default('dev'),
    SERVER_PORT: Joi.number().default(3000),
    BASE_URL: Joi.string().required(),
    // Database
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().required(),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().allow('').required(),
    DB_NAME: Joi.string().required(),
    // Tokens
    ACCESS_TOKEN_SECRET: Joi.string().required(),
    ACCESS_TOKEN_EXPIRY: Joi.number().required(),
    REFRESH_TOKEN_EXPIRY: Joi.number().required(),
    // Email
    EMAIL_FROM: Joi.string().required(),
    MAIL_SERVICE: Joi.string().required(),
    MAIL_AUTH_USER: Joi.string().required(),
    MAIL_AUTH_PASSWORD: Joi.string().required(),
    RESET_PASSWORD_URL: Joi.string().required(),
  }),
  validationOptions: { abortEarly: true },
};

export const databaseConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => {
    return {
      type: 'mysql',
      host: configService.get('DB_HOST'),
      port: configService.get<number>('DB_PORT'),
      username: configService.get('DB_USERNAME'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_NAME'),
      timezone: '+0',
      // .js because of we're taking entities from dist/
      entities: [__dirname + '/infrastructure/database/models/*.js'],
      synchronize: configService.get('NODE_ENV') === 'dev',
      logging: false,
    };
  },
  inject: [ConfigService],
};

export const loggingConfig = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => {
    return {
      level: configService.get('NODE_ENV') === 'dev' ? 'debug' : 'info',
      format: winston.format.json(),
      transports: [
        new winston.transports.Console(),
        //    new winston.transports.File({ filename: 'logfile.log' }),
      ],
    };
  },
  inject: [ConfigService],
};

export const staticFilesConfig = {
  rootPath: join(__dirname, '..', 'client/dist'),
};

export const emailConfig = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => {
    return {
      transport: {
        service: configService.get('MAIL_SERVICE'),
        auth: {
          user: configService.get('MAIL_AUTH_USER'),
          pass: configService.get('MAIL_AUTH_PASSWORD'),
        },
      },
      defaults: {
        from: configService.get('EMAIL_FROM'),
      },
    };
  },
  inject: [ConfigService],
};
