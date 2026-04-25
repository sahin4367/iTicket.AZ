import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Ticket } from "./ticket.model";
import { EEventType } from "../../Core/app/enums";

@Entity({ name: "events" })
export class Event extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 255 })
    title : string;

    @Column({ type : "enum" , enum : EEventType , default : EEventType.CONCERT})
    type : EEventType;

    @Column({ type: "text" })
    description: string;

    @Column({ type: "varchar", length: 255 })
    location: string;

    @Column({ type: "int", default: 0 })
    availableTickets: number;

    @Column({ type: "timestamp" })   
    date: Date;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @DeleteDateColumn({ type: "timestamp" })
    deletedAt: Date;

    @Column({ type: "boolean", default: false })
    isDeleted: boolean;

    @OneToMany(() => Ticket, (ticket) => ticket.event)
    tickets: Ticket[];
}


