import {
  Injectable,
  HttpException,
  HttpStatus,
  //   ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './schema';
import { User } from '@/users/schema';
import { Comment } from '@/comment/schema';
import { ConfigService } from '@nestjs/config';
import { MultipartDto, UpdatePostInputDto } from './dto';
import { MultipartService } from './multipart';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    private multipart: MultipartService,
    private config: ConfigService,
  ) {}

  async getAllPost() {
    const allPost = await this.postModel.find({}).sort({ date: -1 });
    if (!allPost) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return allPost;
  }
  async getPostById(postId: string) {
    // GET /post/:id
    const post = await this.postModel.findById(postId);
    if (!post) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return post;
  }
  async createNewPost(dto: MultipartDto, userId: string): Promise<Post> {
    const currentUser = await this.userModel
      .findById(userId)
      .select('-password');
    if (!currentUser.admin) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const { image, imageId } = await this.multipart.uploadCloudinary(dto.image);

    const content = await this.multipart.readFormDataText(dto.content);

    const newPost = new this.postModel({
      content,
      image,
      imageId,
      name: currentUser.name,
      author: currentUser.id,
    });

    const savePost = await newPost.save();

    return savePost;
  }
  async updatePost(dto: UpdatePostInputDto, userId: string, postId: string) {
    const currentUser = await this.userModel
      .findById(userId)
      .select('-password');
    const post = await this.postModel.findById(postId);
    if (!post) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    if (post.author.toString() !== currentUser.id) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    const updatedPost = await this.postModel.findByIdAndUpdate(
      postId,
      { ...dto, updatedAt: new Date() },
      {
        new: true,
        returnDocument: 'after',
      },
    );

    return updatedPost;
  }
  async deletePostById(postId: string, userId: string) {
    const currentUser = await this.userModel
      .findById(userId)
      .select('-password');
    if (!currentUser) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    const post = await this.postModel.findById(postId);
    if (!post) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    // check if author is authorized
    if (post.author.toString() !== currentUser.id || !currentUser.admin) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    // delete comments related to comment
    const comments = await this.commentModel.find({ post: postId });
    if (comments.length > 0) {
      await this.commentModel.deleteMany({ post: postId }).catch(() => {
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });
    }
    // delete cloudinary image
    await this.multipart.deleteCloudinaryImage(post.imageId);
    // delete post
    try {
      await this.postModel.findByIdAndDelete(postId);
    } catch (error) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return new HttpException('Accepted', HttpStatus.ACCEPTED);
  }
}
