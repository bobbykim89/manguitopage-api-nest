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
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(JwtGuard)
  @ApiOperation({
    summary:
      'Get current user info based on bearer token on Authorization header',
  })
  @Get()
  getCurrentUser(@GetUser('id') userId: string) {
    return this.authService.getCurrentUser(userId);
  }

  @ApiOperation({
    summary: 'login user based on user credentials',
  })
  @HttpCode(HttpStatus.OK)
  @Post()
  loginUser(@Body() dto: AuthInputDto) {
    return this.authService.loginUser(dto);
  }
}
