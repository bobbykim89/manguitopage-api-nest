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
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Comment')
@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @ApiOperation({
    summary: 'get list of all available comment items',
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  getAllComment() {
    return this.commentService.getAlComment();
  }

  @ApiOperation({
    summary: 'get list of comment items related to postId param',
  })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getCommentByPostId(@Param('id') postId: string) {
    return this.commentService.getCommentsByPostId(postId);
  }

  @ApiOperation({
    summary: 'POST new comment related to postId param',
  })
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

  @ApiOperation({
    summary: 'DELETE comment with following commentId',
  })
  @HttpCode(HttpStatus.ACCEPTED)
  @UseGuards(JwtGuard)
  @Delete(':id')
  deleteCommentById(@Param('id') commentId: string, @GetUser() userId: string) {
    return this.commentService.deleteCommentById(commentId, userId);
  }
}
