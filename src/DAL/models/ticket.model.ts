import { BaseEntity, BeforeInsert, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ETicketStatus, ETicketType } from "../../Core/app/enums";
import { User } from "./user.model";
import { Event } from "./event.model";
import { v4 as uuidv4 } from "uuid"
import { Order } from "./order.model";

@Entity({ name: "tickets" })
export class Ticket extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 255 })
    name: string;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    price: number;

    @Column({ type : "enum" , enum : ETicketType , default : ETicketType.STANDARD})
    type : ETicketType;

    @Column({ type : "enum", enum: ETicketStatus, default : ETicketStatus.ACTIVE })
    status: ETicketStatus;

    @ManyToOne(() => User, (user) => user.tickets, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user: User;

    @ManyToOne(() => Event, (event) => event.tickets, { onDelete: "CASCADE" })
    @JoinColumn({ name: "event_id" })
    event: Event;

    @ManyToOne(() => Order , order => order.ticket)
    @JoinColumn({ name : "order_id" })
    order : Order;

    @Column({ type: 'text', nullable: true })
    qrCode: string;

    @BeforeInsert()
    generateQRCode () {
        this.qrCode = uuidv4(); 
    }

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;
    
    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;
    
    @DeleteDateColumn({ type: "timestamp" })
    deletedAt: Date;
    
    @Column({ type: "boolean", default: false })
    isDeleted: boolean;

}
