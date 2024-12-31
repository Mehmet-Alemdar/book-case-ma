import {
  IsNumberString,
  IsString,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class SearchBookDto {
  @IsNotEmpty()
  @IsString()
  search: string;

  @IsOptional()
  @IsNumberString()
  page: number;

  @IsOptional()
  @IsNumberString()
  limit: number;
}
