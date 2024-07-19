import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Body,
  Param,
  Post,
  UseGuards,
  Put,
} from '@nestjs/common';
import { PostService } from './post.service';
import { MultipartDto, UpdatePostInputDto } from './dto';
import { GetUser } from '@/auth/decorator';
import { JwtGuard } from '@/auth/guard';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  getAllPost() {
    return this.postService.getAllPost();
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getPostById(@Param('id') postId: string) {
    return this.postService.getPostById(postId);
  }

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtGuard)
  @Post()
  createNewPost(@Body() dto: MultipartDto, @GetUser() userId: string) {
    return this.postService.createNewPost(dto, userId);
  }

  @UseGuards(JwtGuard)
  @Put(':id')
  updatePost(
    @Body() dto: UpdatePostInputDto,
    @GetUser() userId: string,
    @Param('id') postId: string,
  ) {
    return this.postService.updatePost(dto, userId, postId);
  }
}
