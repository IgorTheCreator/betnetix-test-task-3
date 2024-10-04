import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: 'Username', type: String })
  @IsString()
  username: string;

  @ApiProperty({ description: 'Password', type: String })
  @IsString()
  password: string;
}
