import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class MultiPartBaseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fieldname: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  mimetype: string;
}

export class ImageInputDto extends MultiPartBaseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  filename: string;

  @ApiProperty()
  _buf: Buffer;
}

export class ContentInputDto extends MultiPartBaseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  value: string;
}

export class MultipartDto {
  @ApiProperty()
  image: ImageInputDto;

  @ApiProperty()
  content: ContentInputDto;
}
