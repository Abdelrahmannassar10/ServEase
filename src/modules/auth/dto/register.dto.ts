import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { City, ServiceCategory } from '@common/types/enum';

export class ProviderRegisterDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  mobileNumber: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  password: string;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  dob: Date;

  @IsString()
  @IsNotEmpty()
  @IsEnum(City)
  city: City;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(500)
  writtenCv: string;

  @IsString()
  @IsNotEmpty()
  @Length(14, 14)
  @Matches(/^\d+$/, { message: 'nationalNumber must contain only digits' })
  nationalNumber: string;

  @IsEnum(ServiceCategory)
  service: ServiceCategory;

  @IsString()
  specialization: string;
}

///////////////////////////////////////////
export class CustomerRegisterDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  mobileNumber: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  password: string;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  dob: Date;

  @IsString()
  @IsNotEmpty()
  @IsEnum(City)
  city: City;

  @IsString()
  @IsNotEmpty()
  state: string;
}
