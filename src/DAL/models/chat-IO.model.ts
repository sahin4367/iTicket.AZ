import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.model";

@Entity({name : "messages"})
export class Message extends BaseEntity {
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    content : string;

    @Column({nullable : true})
    imageUrl : string;

    @CreateDateColumn()
    timestamp : Date;

    @ManyToOne(() => User , user => user.messageSend)
    sender : User;

    @ManyToOne(() => User , user => user.messageReceiver)
    receiver : User;
}