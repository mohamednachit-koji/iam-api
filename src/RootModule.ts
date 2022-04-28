import { injectFeature } from './utils';
// Modules
import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
// Middlewares
import requestIp from 'request-ip';
// Controllers
import { OidcController } from 'application/http/controllers/OidcController';
import { AccountController } from 'application/http/controllers/AccountController';
import { UserManagementController } from 'application/http/controllers/UserManagementController';
// Features
import { UpdateResetPassword } from 'domain/features/UpdateResetPassword';
import { ImpersonateUser } from 'domain/features/ImpersonateUser';
import { AuthenticateUser } from 'domain/features/AuthenticateUser';
import { FetchUserInfo } from 'domain/features/FetchUserInfo';
import { LogoutUser } from 'domain/features/LogoutUser';
import { RefreshAccessToken } from 'domain/features/RefreshAccessToken';
import { ResetUserPassword } from 'domain/features/ResetUserPassword';
import { RevokeRefreshToken } from 'domain/features/RevokeRefreshToken';
import { UpdateUserPassword } from 'domain/features/UpdateUserPassword';
// Repositories
import { JwtTokenRepository } from 'infrastructure/token/JwtTokenRepository';
import { BcryptService } from 'infrastructure/Encryption/BcryptService';
import { NodeEmailService } from 'infrastructure/email/NodeEmailService';
import { UserRefreshTokenModelRepository } from 'infrastructure/database/repositories/UserRefreshTokenModelRepository';
import { UserModelRepository } from 'infrastructure/database/repositories/UserModelRepository';
import { UserModelMapper } from 'infrastructure/database/mappers/UserModelMapper';
// Config
import {
  envConfig,
  databaseConfig,
  loggingConfig,
  staticFilesConfig,
  emailConfig,
} from './config';

@Module({
  imports: [
    ConfigModule.forRoot(envConfig),
    TypeOrmModule.forRootAsync(databaseConfig),
    WinstonModule.forRootAsync(loggingConfig),
    ServeStaticModule.forRoot(staticFilesConfig),
    MailerModule.forRootAsync(emailConfig),
  ],
  controllers: [OidcController, AccountController, UserManagementController],
  providers: [
    // Providers
    Logger,
    JwtTokenRepository,
    BcryptService,
    NodeEmailService,
    UserRefreshTokenModelRepository,
    UserModelRepository,
    UserModelMapper,
    // Features
    injectFeature(UpdateResetPassword, [
      JwtTokenRepository,
      UserModelRepository,
      BcryptService,
    ]),
    injectFeature(ImpersonateUser, [UserModelRepository, JwtTokenRepository]),
    injectFeature(AuthenticateUser, [
      UserModelRepository,
      BcryptService,
      JwtTokenRepository,
    ]),
    injectFeature(FetchUserInfo, [UserModelRepository]),
    injectFeature(LogoutUser, [JwtTokenRepository]),
    injectFeature(RefreshAccessToken, [
      JwtTokenRepository,
      UserModelRepository,
    ]),
    injectFeature(ResetUserPassword, [
      UserModelRepository,
      JwtTokenRepository,
      NodeEmailService,
    ]),
    injectFeature(RevokeRefreshToken, [JwtTokenRepository]),
    injectFeature(UpdateUserPassword, [UserModelRepository, BcryptService]),
  ],
})
export class RootModule implements NestModule {
  constructor() {}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(requestIp.mw()).forRoutes('*');
  }
}
