import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  bookStoreId: number;
}
