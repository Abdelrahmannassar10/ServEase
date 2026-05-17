import { IsEmail, IsString, Length } from "class-validator";

export class CheckOTPDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(5, 5, { message: 'OTP must be exactly 5 characters long' })
  otp: string;
}