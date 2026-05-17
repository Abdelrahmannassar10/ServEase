import { IsEmail } from "class-validator";

export class ForgetPasswordOTPDto {
  @IsEmail()
  email: string;
}