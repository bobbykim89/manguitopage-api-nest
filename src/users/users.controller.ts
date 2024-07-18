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

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  signupUser(@Body() dto: UserInputDto) {
    return this.userService.signupUser(dto);
  }

  @UseGuards(JwtGuard)
  @Put('password')
  updatePassword(@Body() dto: NewPwInputDto, @GetUser('id') userId: string) {
    return this.userService.updatePassword(dto, userId);
  }

  @UseGuards(JwtGuard)
  @Put('username')
  updateUsername(
    @Body() dto: NewUsernameInputDto,
    @GetUser('id') userId: string,
  ) {
    return this.userService.updateUsername(dto, userId);
  }
}
