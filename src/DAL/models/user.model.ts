import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Ticket } from "./ticket.model";
import { Order } from "./order.model";
import { Cart } from "./cart.model";
import { Message } from "./chat-IO.model";
import { Payment } from "./payment.model";
import { EUserRole } from "../../Core/app/enums";

@Entity({name : "users"})
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id : number;

    @Column({type : "varchar" , length : 150 , default : null})
    name : string;

    @Column({type : "varchar" , length : 150 , default : null})
    surname : string;

    @Column({type : "varchar" , length : 13 , default : null})
    phone : string;

    @Column({type : "varchar" , length : 150})
    email : string;

    @Column({type : "varchar" , length : 150})
    password : string;

    @Column({type : "enum" , enum : EUserRole , default : EUserRole.ADMIN})
    role: EUserRole;

    @CreateDateColumn({type : "datetime" , nullable : true})
    createdAt: Date;

    @Column({type : "boolean" , default : false})
    isVerifiedEmail : boolean;

    @Column({type : "datetime" , nullable : true})
    codeExpireAt : Date | null;

    @Column({type : "int" , nullable: true})
    verifyCode : number | null;

    @UpdateDateColumn({type : "datetime" , nullable : true})
    updatedAt: Date;

    @DeleteDateColumn({type : "datetime" , nullable : true})
    deletedAt: Date;

    @Column({default : false})
    isDeleted : boolean; 


    // @OneToMany(() => Ticket, (ticket) => ticket.user)
    // tickets : Ticket[];

    @OneToMany(() => Order , order => order.user)
    order : Order[];

    @OneToOne(() => Cart , cart => cart.user , {onDelete : "CASCADE"})
    cart : Cart;

    @OneToMany(() => Message , message => message.sender)
    messageSend : Message[]; //Chat-SocketIO

    @OneToMany(() => Message , message => message.receiver)
    messageReceiver : Message[];

    @OneToMany(() => Payment , payment => payment.user)
    payment : Payment[];
}