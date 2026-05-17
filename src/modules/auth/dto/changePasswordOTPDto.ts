import { IsEmail, IsString, Length } from 'class-validator';

export class ChangePasswordOTPDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(5, 5, { message: 'OTP must be exactly 5 characters long' })
  otp: string;

  @IsString()
  @Length(8, 8, { message: 'New password must be exactly 8 characters long' })
  newPassword: string;
}
