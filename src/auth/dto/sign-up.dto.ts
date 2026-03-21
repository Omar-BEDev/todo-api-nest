
import { 
    IsEmail, 
    IsString, 
    IsStrongPassword, 
    MaxLength, 
    MinLength 
} from "class-validator";


export class SignUpDto {
    @MinLength(2)
    @MaxLength(30)
    @IsString()
    name : string

    @MinLength(2)
    @MaxLength(30)
    @IsString()
    nickName : string

    @IsEmail()
    @IsString()
    email : string

    @IsStrongPassword()
    @IsString()
    @MinLength(8)
    @MaxLength(30)
    password : string
}