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
import { DbConfigService } from './config/db/config.service';
import { join } from 'path';
import { S3Module } from './modules/s3/s3.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [DbConfigModule],
      useFactory: (dbConfigService: DbConfigService) => ({
        type: 'postgres',
        host: dbConfigService.dbHost,
        port: dbConfigService.dbPort,
        username: dbConfigService.dbUser,
        password: dbConfigService.dbPassword,
        database: dbConfigService.dbName,
        entities: [join(__dirname, '**/*.entity.{js,ts}')],
        migrations: [join(__dirname, 'migrations/**/*.{js,ts}')],
        synchronize: dbConfigService.nodeEnv === 'test',
        logging: dbConfigService.nodeEnv === 'development',
        migrationsRun: dbConfigService.nodeEnv === 'development',
      }),
      inject: [DbConfigService],
    }),
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
