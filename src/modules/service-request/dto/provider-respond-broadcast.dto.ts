import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  Min,
  ValidateIf,
} from 'class-validator';

export enum BroadcastResponseAction {
  ACCEPT = 'ACCEPT',
  COUNTER_OFFER = 'COUNTER_OFFER',
  REFUSE = 'REFUSE',
}

export class ProviderRespondBroadcastDto {
  @IsString()
  @IsNotEmpty()
  requestId: string;

  @IsEnum(BroadcastResponseAction)
  action: BroadcastResponseAction;

  @ValidateIf((o) => o.action !== BroadcastResponseAction.REFUSE)
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  offeredEndTime: string;

  @ValidateIf((o) => o.action === BroadcastResponseAction.COUNTER_OFFER)
  @IsNumber()
  @Min(150)
  offeredPrice?: number;
}
