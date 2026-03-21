import { 
    IsEmail,
    IsString,
    IsStrongPassword,
    MinLength,
    MaxLength
} from "class-validator"

export class SignInDto {
    @IsEmail()
    @IsString()
    email : string

    @IsStrongPassword()
    @IsString()
    @MinLength(8)
    @MaxLength(30)
    password : string
}