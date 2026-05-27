import { IsEmail, IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class CreateAdminDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;
    
    @IsString()
    @IsNotEmpty()   
    lastName: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    @Length(8, 80, { message: 'password must be at least 8 characters long' })
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/, { message: 'password must contain at least one letter and one number' })   
    password: string;
}
