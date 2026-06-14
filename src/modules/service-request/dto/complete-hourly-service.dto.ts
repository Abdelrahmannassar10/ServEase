import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CompleteHourlyServiceDto {
  @IsString()
  @IsNotEmpty()
  requestId: string;

  @IsString()
  @IsNotEmpty()
  completionCode: string;

  @IsNumber()
  @Min(1)
  hoursWorked: number;
}
