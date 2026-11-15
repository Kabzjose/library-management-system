import { IsInt, IsISBN, IsNotEmpty, IsPositive, IsString, Min } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title !: string;

  @IsString()
  @IsNotEmpty()
  author !: string;

  @IsISBN()
  isbn !: string;

  @IsInt()
  @Min(0)
  totalCopies !: number;

  @IsInt()
  @IsPositive()
  genreId !: number;
}