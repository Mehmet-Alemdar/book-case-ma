import { IsNumberString, IsOptional, IsNotEmpty } from 'class-validator';

export class FindBooksByStoreIdDto {
  @IsNotEmpty()
  @IsNumberString()
  bookStoreId: number;

  @IsOptional()
  @IsNumberString()
  page: number;

  @IsOptional()
  @IsNumberString()
  limit: number;
}
