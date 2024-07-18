import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ConnectMongoModule } from './connect-mongo/connect-mongo.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ConnectMongoModule,
    AuthModule,
    UsersModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
