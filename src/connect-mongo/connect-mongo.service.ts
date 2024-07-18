import { Injectable } from '@nestjs/common';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConnectMongoService implements MongooseOptionsFactory {
  dbUrl: string;
  constructor(config: ConfigService) {
    this.dbUrl = config.get<string>('DB_URL');
  }
  createMongooseOptions():
    | Promise<MongooseModuleOptions>
    | MongooseModuleOptions {
    return {
      uri: this.dbUrl,
    };
  }
}
