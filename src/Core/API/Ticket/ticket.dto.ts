import { IsEnum, IsNotEmpty, IsNumber, IsString, IsUUID, Max, MaxLength, Min, MinLength } from "class-validator";
import { ETicketStatus, ETicketType } from "../../app/enums";

export class TicketDTO {
    @IsString()
    @MinLength(3)
    @MaxLength(15)
    name : string;

    @IsNumber()
    @Min(0)
    @Max(1000)
    price : number;

    @IsEnum(ETicketType)
    type :  ETicketType;

    @IsEnum(ETicketStatus)
    status : ETicketStatus;

    @IsNumber()
    user_id: number;

    @IsNumber()
    event_id: number;
}