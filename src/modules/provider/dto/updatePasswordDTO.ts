import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class updatePasswordDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
}
