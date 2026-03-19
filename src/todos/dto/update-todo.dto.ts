import {
    IsOptional,
    IsString, 
    MaxLength, 
    MinLength 
} from "class-validator";


export class UpdateTodoDto {
    @IsString()
    @MaxLength(50)
    @MinLength(2)
    name : string

    @IsString()
    @MaxLength(500)
    @MinLength(1)
    @IsOptional()
    description : string

}