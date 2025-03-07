import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './modules/auth/guards/role.guard';
import { DbConfigModule } from './config/db/config.module';
import { AppConfigModule } from './config/app/config.module';
import { AwsConfigModule } from './config/aws/config.module';
import { S3Module } from './modules/s3/s3.module';
import { AppDataSource } from './ormConfig';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    AuthModule,
    UsersModule,
    DbConfigModule,
    AppConfigModule,
    AwsConfigModule,
    S3Module,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
