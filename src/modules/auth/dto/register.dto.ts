import {
  IsDate,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
  Min,
  IsNumber,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { City, Gender,  state } from '@common/types/enum';
import mongoose from 'mongoose';

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
  @Length(8, 80, { message: 'password must be at least 8 characters long' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/, {
    message: 'password must contain at least one letter and one number',
  })
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
  @IsEnum(state)
  state: state;

  @IsOptional()
  @IsString()
  @MinLength(6)
  writtenCv: string;

  @IsString()
  @IsNotEmpty()
  @Length(14, 14)
  @Matches(/^\d+$/, { message: 'nationalNumber must contain only digits' })
  nationalNumber: string;

  @IsNotEmpty()
  @IsMongoId()
  service: mongoose.Types.ObjectId;

  @IsString()
  specialization: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  hourPrice: number;
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
  @Length(8, 80, { message: 'password must be at least 8 characters long' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/, {
    message: 'password must contain at least one letter and one number',
  })
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
  @IsEnum(state)
  state: state;

  @IsString()
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;
}
