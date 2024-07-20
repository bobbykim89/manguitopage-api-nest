import { IsString, IsNotEmpty } from 'class-validator';

export class CommentInputDto {
  @IsNotEmpty()
  @IsString()
  text: string;
}
