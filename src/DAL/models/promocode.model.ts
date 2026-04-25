import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Order } from "./order.model";

@Entity({name : "promocodes"})
export class PromoCode extends BaseEntity {
    @PrimaryGeneratedColumn()
    id : number;

    @Column({unique : true})
    code : string;

    @Column()
    discountPercentage : number;

    @CreateDateColumn()
    createdAt : Date;

    @Column({ type: "timestamp", nullable: true })
    expiresAt: Date | null;

    @UpdateDateColumn()
    updatedAt : Date;

    @DeleteDateColumn()
    deletedAt : Date;

    @Column({default : 0})
    userLimit : number;

    @Column({default  : true})
    isActive : boolean;

    @OneToMany(() => Order, order => order.promoCode)
    order : Order[];
}