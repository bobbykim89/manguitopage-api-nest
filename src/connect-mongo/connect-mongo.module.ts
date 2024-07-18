import { Module } from '@nestjs/common';
import { ConnectMongoService } from './connect-mongo.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: ConnectMongoService,
    }),
  ],
})
export class ConnectMongoModule {}
