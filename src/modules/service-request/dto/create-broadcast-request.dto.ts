import {
  IsNotEmpty,
  IsString,
  IsDate,
  Matches,
  IsMongoId,
  IsNumber,
  IsBoolean,
  IsEnum,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { City, state, LocationScope, PaymentMode } from '../../../common/types/enum';

export class CreateBroadcastRequestDto {
  @IsMongoId()
  @IsNotEmpty()
  serviceId: string;

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

  @IsEnum(LocationScope)
  @IsNotEmpty()
  locationScope: LocationScope;

  @IsBoolean()
  matchByTopRated: boolean;

  @IsEnum(PaymentMode)
  @IsNotEmpty()
  paymentMode: PaymentMode;

  @ValidateIf((o) => o.paymentMode === PaymentMode.FIXED)
  @IsNumber()
  preferredPrice?: number;
}
