import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

import { ROLES } from '../../common/constants';

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
    type: String,
    description: 'Username',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({
    example: 'john@live.com',
    type: String,
    description: 'User email',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    type: String,
    description: 'User password',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'admin',
    enum: ROLES,
    description: 'User role',
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(ROLES)
  role: ROLES;
}

export class UpdateUserDto extends PartialType(CreateUserDto) { }
