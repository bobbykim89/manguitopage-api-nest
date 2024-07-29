import {
  Controller,
  Post,
  Put,
  HttpCode,
  HttpStatus,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserInputDto, NewPwInputDto, NewUsernameInputDto } from './dto';
import { JwtGuard } from '@/auth/guard';
import { GetUser } from '@/auth/decorator';
import { ApiOperation } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @ApiOperation({
    summary: 'POST new user data with provided user credentials',
  })
  @HttpCode(HttpStatus.OK)
  @Post()
  signupUser(@Body() dto: UserInputDto) {
    return this.userService.signupUser(dto);
  }

  @ApiOperation({
    summary: 'PUT password of current user data with provided passwords',
  })
  @UseGuards(JwtGuard)
  @Put('password')
  updatePassword(@Body() dto: NewPwInputDto, @GetUser('id') userId: string) {
    return this.userService.updatePassword(dto, userId);
  }

  @ApiOperation({
    summary: 'PUT new username of current user with provided username',
  })
  @UseGuards(JwtGuard)
  @Put('username')
  updateUsername(
    @Body() dto: NewUsernameInputDto,
    @GetUser('id') userId: string,
  ) {
    return this.userService.updateUsername(dto, userId);
  }
}
