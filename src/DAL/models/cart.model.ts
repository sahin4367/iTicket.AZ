import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.model";
import { CartTicket } from "./Cart-Ticket.model";
import { Order } from "./order.model";

@Entity({ name: "carts" })
export class Cart extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User, (user) => user.cart, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user: User;

    @OneToOne(() => Order , order => order.cart , { onDelete : "CASCADE"})
    order : Order;

    @OneToMany(() => CartTicket, (cartTicket) => cartTicket.cart, {
        cascade: true,
    })
    cartTickets: CartTicket[];

    @Column({ type: "float", default: 0 })
    totalPrice: number;
}
