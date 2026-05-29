import { IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateGeneralSettingDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  webCommission?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  providerDebt?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  providerCancelFee?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  providerCancelCount?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  revenue?: number;
}
