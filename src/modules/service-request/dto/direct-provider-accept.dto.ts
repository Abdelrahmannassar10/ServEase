import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';

export class DirectProviderAcceptDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  price?: number;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  endTime: string;
}
