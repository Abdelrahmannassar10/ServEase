import { City } from '@common/types/enum';
import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  mobileNumber: string;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  dob: Date;

  @IsOptional()
  @IsString()
  @IsEnum(City)
  city: City;

  @IsOptional()
  @IsString()
  state: string;
}
