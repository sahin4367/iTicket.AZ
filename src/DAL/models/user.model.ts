import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { EUsesrRole } from "../../Core/app/enums";
import { Model, DataTypes } from "sequelize";
import { Ticket } from "./ticket.model";
import { Order } from "./order.model";
import { Cart } from "./cart.model";

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

    @Column({type : "enum" , enum : EUsesrRole , default : EUsesrRole.ADMIN})
    role: EUsesrRole;

    @CreateDateColumn({type : "datetime" , nullable : true})
    createdAt: Date;

    @Column({type : "boolean" , default : false})
    isVerifiedEmail : boolean;

    @Column({type : "datetime" , nullable : true})
    codeExpireAt : Date;

    @Column({type : "varchar" , nullable: true})
    verifyCode : string | null;

    @UpdateDateColumn({type : "datetime" , nullable : true})
    updatedAt: Date;

    @DeleteDateColumn({type : "datetime" , nullable : true})
    deletedAt: Date;

    @Column({default : false})
    isdeleted : boolean;

    @OneToMany(() => Ticket, (ticket) => ticket.user)
    tickets : Ticket[];

    @OneToMany(() => Order , order => order.user)
    order : Order[];

    @OneToOne(() => Cart , cart => cart.user , {onDelete : "CASCADE"})
    cart : Cart;
}