import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostInputDto {
  @ApiProperty({
    description: 'content text value',
  })
  @IsNotEmpty()
  @IsString()
  content: string;
}
