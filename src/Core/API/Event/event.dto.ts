import { IsDate, IsEnum, IsNumber, IsString, Max, MaxLength, Min, MinLength } from "class-validator";
import { EEventType } from "../../app/enums";


export class CreateEventDto {
    @IsString()
    @MinLength(3)
    @MaxLength(255)
    title: string;

    @IsString()
    @MinLength(3)
    @MaxLength(255)
    description: string;

    @IsEnum(EEventType)
    type: EEventType;

    @IsString()
    @MinLength(3)
    @MaxLength(255)
    location: string;

    @IsNumber()
    @Max(100000)
    @Min(0)
    availableTickets: number;

    @IsDate()
    date: Date;
}

export class UpdateEventDTO {
    @IsString()
    @MinLength(3)
    @MaxLength(255)
    title: string;

    @IsString()
    @MinLength(3)
    @MaxLength(255)
    description: string;

    @IsEnum(EEventType)
    type: EEventType;

    @IsString()
    @MinLength(3)
    @MaxLength(255)
    location: string;

    @IsNumber()
    @Max(100000)
    @Min(0)
    availableTickets: number;

    @IsDate()
    date: Date;
}