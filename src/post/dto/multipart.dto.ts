import { IsString } from 'class-validator';

class MultiPartBaseDto {
  @IsString()
  type: string;

  @IsString()
  fieldname: string;

  @IsString()
  mimetype: string;
}

export class ImageInputDto extends MultiPartBaseDto {
  @IsString()
  filename: string;

  _buf: Buffer;
}

export class ContentInputDto extends MultiPartBaseDto {
  @IsString()
  value: string;
}

export class MultipartDto {
  image: ImageInputDto;
  content: ContentInputDto;
}
