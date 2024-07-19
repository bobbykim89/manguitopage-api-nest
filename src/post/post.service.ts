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
import { ConfigService } from '@nestjs/config';
import { MultipartDto, UpdatePostInputDto } from './dto';
import { MultipartService } from './multipart';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
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
    // if (!currentUser.admin) {
    //   throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    // }

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
    const updatedPost = await this.postModel.findByIdAndUpdate(postId, dto, {
      new: true,
      returnDocument: 'after',
    });

    return updatedPost;
  }
}
