import {
    IsString, 
    MaxLength, 
    MinLength 
} from "class-validator";


export class CreateTodoDto {
    @IsString()
    @MaxLength(50)
    @MinLength(2)
    name : string

    @IsString()
    @MaxLength(500)
    @MinLength(1)
    description : string

}