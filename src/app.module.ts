import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConnectMongoModule } from './connect-mongo/connect-mongo.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ConnectMongoModule,
    AuthModule,
    UsersModule,
    PostModule,
    CommentModule,
  ],
})
export class AppModule {}
