import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class AuthInputDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minSymbols: 1,
  })
  password: string;
}
