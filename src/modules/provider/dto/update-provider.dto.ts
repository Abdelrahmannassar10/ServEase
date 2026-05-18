import { City, Gender, ServiceCategory, state } from '@common/types/enum';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateProviderDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
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
  @IsEnum(state)
  state: state;

  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(500)
  writtenCv: string;
  
  @IsOptional()
  @IsString()
  @Length(14, 14)
  @Matches(/^\d+$/, { message: 'nationalNumber must contain only digits' })
  nationalNumber: string;
  
  @IsOptional()
  @IsEnum(ServiceCategory)
  service: ServiceCategory;
  
  @IsOptional()
  @IsString()
  specialization: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;
}
