import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class ConfirmOTPDto {


  @IsString()
  @IsEmail()
  @IsNotEmpty()  
  email: string;
    @IsString()
    @IsNotEmpty()
  otp: string;
}