import { IsNumber, IsNotEmpty } from 'class-validator';

export class UpdateBookQuantityDto {
  @IsNumber()
  @IsNotEmpty()
  bookId: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  bookStoreId: number;
}
