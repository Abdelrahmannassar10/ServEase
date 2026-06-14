import { IsNotEmpty, IsString, IsDate, Matches, IsMongoId, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { City, state } from '../../../common/types/enum';

export class CreateServiceRequestDto {
  @IsMongoId()
  @IsNotEmpty()
  providerId: string;

  @IsEnum(City)
  @IsNotEmpty()
  governorate: City;

  @IsEnum(state)
  @IsNotEmpty()
  city: state;

  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  exactLocation: string;

  @IsString()
  @IsNotEmpty()
  serviceNeeded: string;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  dateNeeded: Date;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  startTime: string;
}
