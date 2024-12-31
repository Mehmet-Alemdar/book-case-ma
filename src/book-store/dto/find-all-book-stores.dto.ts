import { IsNumberString, IsOptional } from 'class-validator';

export class FindAllBookStoresDto {
  @IsOptional()
  @IsNumberString()
  page: number;

  @IsOptional()
  @IsNumberString()
  limit: number;
}
