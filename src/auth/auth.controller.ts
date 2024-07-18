import {
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthInputDto } from './dto';
import { GetUser } from './decorator';
import { JwtGuard } from './guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(JwtGuard)
  @Get()
  getCurrentUser(@GetUser('id') userId: string) {
    console.log(userId);
    return this.authService.getCurrentUser(userId);
  }

  @HttpCode(HttpStatus.OK)
  @Post()
  loginUser(@Body() dto: AuthInputDto) {
    return this.authService.loginUser(dto);
  }
}
