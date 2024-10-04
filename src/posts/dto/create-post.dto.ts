import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ description: 'Title', type: String })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Content', type: String })
  @IsString()
  content: string;
}
