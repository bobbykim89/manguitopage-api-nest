import { IsNotEmpty, IsString } from 'class-validator';

class MultiPartBaseDto {
  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  fieldname: string;

  @IsNotEmpty()
  @IsString()
  mimetype: string;
}

export class ImageInputDto extends MultiPartBaseDto {
  @IsNotEmpty()
  @IsString()
  filename: string;

  _buf: Buffer;
}

export class ContentInputDto extends MultiPartBaseDto {
  @IsNotEmpty()
  @IsString()
  value: string;
}

export class MultipartDto {
  image: ImageInputDto;
  content: ContentInputDto;
}
