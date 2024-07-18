import { IsString } from 'class-validator';

export class NewUsernameInputDto {
  @IsString()
  username: string;
}
