import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentInputDto } from './dto';
import { JwtGuard } from '@/auth/guard';
import { GetUser } from '@/auth/decorator';

@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  getAllComment() {
    return this.commentService.getAlComment();
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getCommentByPostId(@Param('id') postId: string) {
    return this.commentService.getCommentsByPostId(postId);
  }

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtGuard)
  @Post(':id')
  createNewComment(
    @Body() dto: CommentInputDto,
    @GetUser() userId: string,
    @Param('id') postId: string,
  ) {
    return this.commentService.createNewComment(dto, userId, postId);
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @UseGuards(JwtGuard)
  @Delete(':id')
  deleteCommentById(@Param('id') commentId: string, @GetUser() userId: string) {
    return this.commentService.deleteCommentById(commentId, userId);
  }
}
