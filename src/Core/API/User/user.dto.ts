import { IsEmail, IsEnum , IsOptional, IsPhoneNumber, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { EUserRole } from "../../app/enums";


export class RegisterDTO {
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

    @IsOptional()
    @IsString()
    password: string;

    @IsEnum(EUserRole)
    role: EUserRole;

}