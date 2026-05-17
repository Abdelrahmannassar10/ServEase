import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class updatePasswordDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(8)
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(8)
  newPassword: string;
}
