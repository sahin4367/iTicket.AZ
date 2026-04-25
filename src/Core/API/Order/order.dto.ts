import { IsEnum, IsNumber } from "class-validator";
import { EOrderStatus } from "../../app/enums";


export class CreateOrderDTO {
    @IsNumber()
    quantity : number;

    @IsNumber()
    totalPrice : number;

    @IsEnum(EOrderStatus)
    status : EOrderStatus;

    @IsNumber()
    user_id : number;

    @IsNumber()
    ticket_id : number;
}

export class UpdateOrderDTO {
    @IsNumber()
    quantity : number;

    @IsNumber()
    user_id : number;

    @IsNumber()
    ticket_id : number;
}