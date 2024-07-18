import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class UserInputDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minSymbols: 1,
  })
  password: string;
}
