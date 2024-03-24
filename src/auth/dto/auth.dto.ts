import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { AuthI } from '../interfaces/auth.interface';

export class AuthDto implements AuthI {
  @ApiProperty({
    example: 'gigihsigap@gmail.com',
    type: String,
    description: 'User email',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456789',
    type: String,
    description: 'User password',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
