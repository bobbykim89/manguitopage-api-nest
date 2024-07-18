import {
  Injectable,
  ForbiddenException,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '@/users/schema';
import { AuthInputDto } from './dto';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async getCurrentUser(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-password');
    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async loginUser(dto: AuthInputDto): Promise<{ access_token: string }> {
    const { email, password } = dto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new ForbiddenException('Incorrect credentials');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ForbiddenException('Incorrect credentials');
    }
    const payload = {
      id: user.id,
      admin: user.admin,
    };
    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: '7d',
      secret: this.config.get<string>('JWT_SECRET'),
    });
    return {
      access_token: `Bearer ${accessToken}`,
    };
  }
}
