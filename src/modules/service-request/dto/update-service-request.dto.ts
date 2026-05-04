import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsNotEmpty,
  Matches,
} from 'class-validator';
import { ServiceStatus } from '../../../common/types/enum';


export class UpdateServiceRequestDto {
  @IsOptional()
  @IsEnum(ServiceStatus)
  status?: ServiceStatus;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  price?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  endTime?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  completionCode?: string;

  @IsOptional()
  @IsNumber()
  providerCancelCount?: number;

  @IsOptional()
  @IsNumber()
  providerCancelFees?: number;
}