import { IsString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class CreateOrderDto {
  @IsString()
  @ApiProperty()
  book_id: string;
}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsString()
  @ApiProperty()
  user_id: string;
}
