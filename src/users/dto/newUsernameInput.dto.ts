import { IsNotEmpty, IsString } from 'class-validator';

export class NewUsernameInputDto {
  @IsNotEmpty()
  @IsString()
  username: string;
}
