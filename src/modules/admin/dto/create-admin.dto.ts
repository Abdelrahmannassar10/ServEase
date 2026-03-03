import { IsEmail, IsNotEmpty, IsString, Length, Matches, matches } from "class-validator";

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
    @Length(8, 20)
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/, { message: 'password must contain at least one letter and one number' })   
    password: string;
}
