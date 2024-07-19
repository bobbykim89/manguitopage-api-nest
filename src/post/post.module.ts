import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { Post, PostSchema } from './schema';
import { User, UserSchema } from '@/users/schema';
import { MultipartService } from './multipart';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [PostController],
  providers: [PostService, MultipartService],
  exports: [MultipartService],
})
export class PostModule {}
