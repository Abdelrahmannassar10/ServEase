import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CustomerSelectOfferDto {
  @IsString()
  @IsNotEmpty()
  requestId: string;

  @IsMongoId()
  @IsNotEmpty()
  offerId: string;
}
