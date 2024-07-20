import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from './schema';
import { User } from '@/users/schema';
import { CommentInputDto } from './dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async getAlComment() {
    const comments = await this.commentModel.find({});

    if (!comments) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return comments;
  }

  async getCommentsByPostId(postId: string) {
    const comments = await this.commentModel.find({ post: postId });

    if (!comments) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return comments;
  }

  async createNewComment(dto: CommentInputDto, userId: string, postId: string) {
    const currentUser = await this.userModel
      .findById(userId)
      .select('-password');
    if (!currentUser) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    const newComment = new this.commentModel({
      text: dto.text,
      name: currentUser.name,
      author: currentUser.id,
      post: postId,
    });
    const saveComment = await newComment.save();
    if (!saveComment) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return saveComment;
  }

  async deleteCommentById(commentId: string, userId: string) {
    const currentUser = await this.userModel
      .findById(userId)
      .select('-password');
    if (!currentUser) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    const comment = await this.commentModel.findById(commentId);
    if (!comment) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    if (comment.author.toString() !== currentUser.id || !currentUser.admin) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    await this.commentModel.findByIdAndDelete(commentId);

    return new HttpException('Accepted', HttpStatus.ACCEPTED);
  }
}
