import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserInputDto {
  @ApiProperty({ description: 'user email input' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'user name input' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'user password input' })
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minSymbols: 1,
  })
  password: string;
}
