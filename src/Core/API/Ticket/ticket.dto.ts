import { IsEnum, IsNotEmpty, IsNumber, IsString, IsUUID, Max, MaxLength, Min, MinLength } from "class-validator";
import { ETicketStatus, ETicketType } from "../../app/enums";

export class TicketDTO {
    @IsNumber()
    @Min(0)
    @Max(1000)
    price : number;

    @IsEnum(ETicketType)
    type :  ETicketType;

    @IsEnum(ETicketStatus)
    status : ETicketStatus;

    @IsNumber()
    event_id: number;
}