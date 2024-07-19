import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
// import { CloudinaryResponse } from './cloudinaryResponse.types';
import { ImageInputDto, ContentInputDto } from '../dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MultipartService {
  private cloudinaryUploader: typeof cloudinary;
  constructor(private config: ConfigService) {
    this.cloudinaryUploader = cloudinary;
    this.cloudinaryUploader.config({
      cloud_name: this.config.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.config.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.config.get<string>('CLOUDINARY_API_SECRET'),
    });
  }
  async uploadCloudinary(
    dto: ImageInputDto,
  ): Promise<{ imageId: string; image: string }> {
    if (dto.mimetype !== 'image/jpeg' && dto.mimetype !== 'image/png') {
      throw new HttpException(
        'Unsupported Media Type',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    const base64EncodedImage = Buffer.from(dto._buf).toString('base64');
    const dataUri = `data:${dto.mimetype};base64,${base64EncodedImage}`;

    const { public_id, secure_url } =
      await this.cloudinaryUploader.uploader.upload(dataUri, {
        folder: this.config.get<string>('CLOUDINARY_FOLDER_NAME'),
      });

    return {
      imageId: public_id,
      image: secure_url,
    };
  }

  async deleteCloudinaryImage(id: string): Promise<void> {
    await this.cloudinaryUploader.uploader.destroy(id);
  }

  async readFormDataText(dto: ContentInputDto) {
    if (typeof dto === 'undefined') {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    if (dto.mimetype !== 'text/plain') {
      throw new HttpException(
        'Unsupported Media Type',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    return dto.value;
  }
}
