import { IsNotEmpty, IsNumber } from 'class-validator';

export class AssignManagerToStoreDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  bookStoreId: number;
}
