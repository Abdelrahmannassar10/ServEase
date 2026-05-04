import { IsNotEmpty, IsString, IsDate, Matches, IsMongoId } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateServiceRequestDto {
  @IsMongoId()
  @IsNotEmpty()
  providerId: string;

  @IsString()
  @IsNotEmpty()
  governorate: string;

  @IsString()
  @IsNotEmpty()
  city: string;

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
