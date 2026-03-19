import { IsEmail, IsStrongPassword, MaxLength, MinLength } from "class-validator";


export class SignUpDto {

    @IsEmail()
    email : string
    
    @IsStrongPassword()
    @MinLength(8)
    @MaxLength(20)
    password : string
}