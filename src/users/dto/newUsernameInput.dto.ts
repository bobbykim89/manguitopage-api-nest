import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class NewUsernameInputDto {
  @ApiProperty({ description: 'new user name input' })
  @IsNotEmpty()
  @IsString()
  username: string;
}
