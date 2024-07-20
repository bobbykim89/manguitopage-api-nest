import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { User } from '@/users/schema';
import { Post } from '@/post/schema';

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  text: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  author: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Post' })
  post: Post;

  @Prop({ default: Date.now })
  date: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
