import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DbConfigService {
  constructor(private configService: ConfigService) {}

  get dbHost() {
    return this.configService.get<string>('db.dbHost');
  }

  get dbPort() {
    return this.configService.get<number>('db.dbPort');
  }

  get dbUser() {
    return this.configService.get<string>('db.dbUser');
  }

  get dbPassword() {
    return this.configService.get<string>('db.dbPassword');
  }

  get dbName() {
    return this.configService.get<string>('db.dbName');
  }

  get nodeEnv() {
    return this.configService.get<string>('db.nodeEnv');
  }
}
