import { IsInt, IsString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateBookDto {
  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  author: string;

  @IsString()
  @ApiProperty()
  cover: string;

  @IsInt()
  @ApiProperty()
  price: number;

  @ApiProperty({ type: [String] })
  tags: string[];

}

export class UpdateBookDto extends PartialType(CreateBookDto) {}
