import { IsEnum, IsNotEmpty, IsOptional, IsString, IsDate, Matches, IsMongoId, IsNumber, Min, ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';
import { City, state, PaymentMode } from '../../../common/types/enum';

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

  // ── Payment Mode ─────────────────────────────────────────────────────────────

  @IsOptional()
  @IsEnum(PaymentMode)
  paymentMode?: PaymentMode;

  @ValidateIf((o) => !o.paymentMode || o.paymentMode === PaymentMode.FIXED)
  @IsOptional()
  @IsNumber()
  @Min(50)
  preferredPrice?: number;
}
