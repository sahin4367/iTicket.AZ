import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { EPaymentStatus } from "../../Core/app/enums";
import { User } from "./user.model";
import { Order } from "./order.model";

@Entity({name : "payments"})
export class Payment extends BaseEntity {
    @PrimaryGeneratedColumn()
    id : number;

    @Column({type : "enum" , enum : EPaymentStatus , default : EPaymentStatus.PENDING})
    status : EPaymentStatus;

    @Column({type : "varchar" , nullable : true})
    paymentId : string;
    
    @Column({type : "varchar" , nullable : true})
    payerId : string;

    @Column({type : "decimal"})
    amount : number;

    @CreateDateColumn()
    createdAt : Date;

    @ManyToOne(() => User , user => user.payment , {onDelete : "CASCADE"})
    @JoinColumn({name : "user_id"})
    user : User;

    @ManyToOne(() => Order , order => order.payment , {onDelete : "CASCADE"})
    @JoinColumn({name : "orderId"})
    order : Order;
}