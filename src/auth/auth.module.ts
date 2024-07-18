import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@/users/schema';
import { JwtModule } from '@nestjs/jwt';
import { AuthStrategy } from './strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      global: true,
    }),
  ],
  providers: [AuthService, AuthStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
