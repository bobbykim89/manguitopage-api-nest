import {
  Injectable,
  HttpException,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema';
import {
  UserInputDto,
  NewPwInputDto,
  NewUsernameInputDto,
  AdminPhraseSecretInputDto,
} from './dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signupUser(dto: UserInputDto): Promise<{ access_token: string }> {
    const { email, password, name } = dto;
    let user = await this.userModel.findOne({ email }).select('-password');
    if (user) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
    user = new this.userModel({
      name,
      email,
      password,
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    const payload = {
      id: user.id,
      admin: user.admin,
    };
    // set access token
    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: '7d',
      secret: this.config.get<string>('JWT_SECRET'),
    });
    return {
      access_token: `Bearer ${accessToken}`,
    };
  }
  async updatePassword(
    dto: NewPwInputDto,
    userId: string,
  ): Promise<HttpException> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    const { newPassword, currentPassword } = dto;
    if (!newPassword || !currentPassword) {
      throw new HttpException('Not Acceptable', HttpStatus.NOT_ACCEPTABLE);
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new ForbiddenException('Incorrect credentials');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);
    const updatedUser = await this.userModel.findByIdAndUpdate(
      user.id,
      { password: hashedNewPassword },
      { new: true, returnDocument: 'after' },
    );
    if (!updatedUser) {
      throw new HttpException(
        'Unexpected Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return new HttpException('Resource Updated Successfully', HttpStatus.OK);
  }
  async updateUsername(dto: NewUsernameInputDto, userId: string) {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        user.id,
        { name: dto.username },
        { new: true, returnDocument: 'after' },
      )
      .select('-password');
    if (!updatedUser) {
      throw new HttpException(
        'Unexpected Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return updatedUser;
  }
  async setAdmin(dto: AdminPhraseSecretInputDto, userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    if (dto.adminPhrase !== this.config.get<string>('ADMIN_PHRASE_SECRET')) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        user.id,
        { admin: true },
        { new: true, returnDocument: 'after' },
      )
      .select('-password');
    if (!updatedUser) {
      throw new HttpException(
        'Unexpected Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return updatedUser;
  }
}
