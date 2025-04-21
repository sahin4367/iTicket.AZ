import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { EOrderStatus } from "../../Core/app/enums";
import { User } from "./user.model";
import { Ticket } from "./ticket.model";
import { Cart } from "./cart.model";
import { PromoCode } from "./promocode.model";
@Entity({  name : "orders" })
export class Order extends BaseEntity {
    @PrimaryGeneratedColumn()
    id : number;

    @Column({type : "int"})
    quantity : number;

    @Column({ type : "decimal" })
    totalPrice : number;

    @Column({ type : "enum" , enum : EOrderStatus , default : EOrderStatus.PENDING })
    status : EOrderStatus;

    @CreateDateColumn()
    createdAt : Date;

    @UpdateDateColumn()
    updatedAt : Date;

    @Column({ type: "boolean", default: false })
    isDeleted: boolean;

    @DeleteDateColumn()
    deletedAt : Date;

    @ManyToOne(() => User , user => user.order)
    @JoinColumn({ name : "user_id" })
    user : User;

    @OneToMany(() => Ticket , ticket => ticket.order)
    ticket : Ticket[];

    @OneToOne(() => Cart, cart => cart.order)
    @JoinColumn({ name: "cart_id" })
    cart: Cart;

    @ManyToOne(() => PromoCode, { nullable: true })
    @JoinColumn({ name: "promocode_id" })
    promoCode?: PromoCode | null;
}