import { IsString, IsStrongPassword } from 'class-validator';

export class NewPwInputDto {
  @IsString()
  currentPassword: string;

  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minSymbols: 1,
  })
  newPassword: string;
}
