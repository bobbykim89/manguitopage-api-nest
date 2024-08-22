import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AdminPhraseSecretInputDto {
  @ApiProperty({ description: 'admin phrase secret input' })
  @IsNotEmpty()
  @IsString()
  adminPhrase: string;
}
