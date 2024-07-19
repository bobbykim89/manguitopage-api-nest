import { IsString } from 'class-validator';

export class UpdatePostInputDto {
  @IsString()
  content: string;
}
