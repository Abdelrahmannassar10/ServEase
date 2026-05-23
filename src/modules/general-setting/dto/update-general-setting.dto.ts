import { IsNumber, IsOptional, Min } from 'class-validator';
export class UpdateGeneralSettingDto {
  @IsOptional()
  @IsNumber()
    @Min(0)
  webCommission?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  providerDebt?: number;
}
