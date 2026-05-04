import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
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
  @MinLength(11)
  @MaxLength(11)
  mobileNumber: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(8)
  password: string;

  @IsNotEmpty()
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
  @MinLength(11)
  @MaxLength(11)
  mobileNumber: string;


  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

 
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  dob: Date;

  @IsNotEmpty()
  @IsEnum(City)
  city: City;

  @IsString()
  @IsNotEmpty()
  state: string;
}
