import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CommentInputDto {
  @ApiProperty({
    description: 'comment text input',
  })
  @IsNotEmpty()
  @IsString()
  text: string;
}
