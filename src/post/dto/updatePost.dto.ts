import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePostInputDto {
  @IsNotEmpty()
  @IsString()
  content: string;
}
