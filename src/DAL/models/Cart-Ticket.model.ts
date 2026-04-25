import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "./cart.model";
import { Ticket } from "./ticket.model";
import Joi from "joi";


@Entity({ name: "cart_tickets" })
export class CartTicket extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Cart, (cart) => cart.cartTickets, { onDelete: "CASCADE" })
    @JoinColumn({ name: "cart_id" })
    cart: Cart;

    @ManyToOne(() => Ticket, { onDelete: "CASCADE" })
    @JoinColumn({ name: "ticket_id" })
    ticket: Ticket;

    @Column({ type: "int" })
    quantity: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    reservedAt: Date;

    @Column({ type: 'timestamp' , nullable : true })
    reservationExpiresAt: Date;
}
