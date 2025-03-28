import {IsBoolean,IsDefined,IsEmail,IsEnum,IsOptional,IsPhoneNumber,IsString,Matches,MaxLength,MinLength} from "class-validator";
import { EUsesrRole } from "../../app/enums";

export class CreateUserByAdminDTO {
    @IsString()
        @IsOptional()
        @MinLength(3)
        @MaxLength(10)
        name: string;
    
        @IsOptional()
        @IsString()
        @MinLength(3)
        @MaxLength(10)
        surname: string;
    
        @IsOptional()
        @IsPhoneNumber()
        @Matches(/^\+994\d{9}$/, {
            message: "Phone number must be in +994XXXXXXXXX format",
        })
        phone: string;
    
        @IsOptional()
        @IsEmail()
        email: string;
    
        @IsString()
        @MinLength(6)
        @MaxLength(10)
        password: string;
    
        @IsEnum(EUsesrRole)
        role: EUsesrRole;

}


export class EditUserByAdminDTO {
    @IsOptional()
    @IsString()
    role: string;
}