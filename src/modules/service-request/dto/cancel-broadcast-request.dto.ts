import { IsNotEmpty, IsString } from 'class-validator';

export class CancelBroadcastRequestDto {
  @IsString()
  @IsNotEmpty()
  requestId: string;
}
