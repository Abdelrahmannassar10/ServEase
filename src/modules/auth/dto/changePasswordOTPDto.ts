import { IsEmail, IsString, Length, Matches, MinLength } from 'class-validator';

export class ChangePasswordOTPDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(5, 5, { message: 'OTP must be exactly 5 characters long' })
  otp: string;

  @IsString()
  @Length(8, 80, { message: 'password must be at least 8 characters long' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/, {
    message: 'password must contain at least one letter and one number',
  })
  newPassword: string;
}
