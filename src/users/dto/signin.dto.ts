import { 
    IsEmail,
    IsString, 
    IsStrongPassword, 
    MaxLength, 
    MinLength 
} from "class-validator"

export class signInDto {
    @IsEmail()
    email : string

    @IsString()
    @MinLength(2)
    @MaxLength(30)
    name : string;

    @IsString()
    @MinLength(2)
    @MaxLength(30)
    nickName : string;

    @MinLength(8)
    @MaxLength(20)
    @IsStrongPassword()
    password : string;
    
}