import { IsEmail, IsString, Length, MinLength } from 'class-validator';

export class ChangePasswordOTPDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(5, 5, { message: 'OTP must be exactly 5 characters long' })
  otp: string;

  @IsString()
  @MinLength(8)
  newPassword: string;
}
