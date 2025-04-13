
export enum EUsesrRole {
    USER = "USER",
    ADMIN = "ADMIN"
}

export enum ETicketStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    DELETED = "DELETED"
}

export enum EEventType {
    CONCERT = "CONCERT",
    FOOTBALL = "FOOTBALL",
    THEATER = "THEATER",
    FESTIVAL = "FESTIVAL"
}

export enum ETicketType {
    VIP = "VIP",
    STANDARD = "STANDARD",
    ECONOMY = "ECONOMY"
}

export enum EOrderStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    CANCLELED = "CANCLELED"
}

export interface UpdateUserDTO {
    name  : string;
    surname : string;
    email : string;
    password : string;
    phone : string;
    role : EUsesrRole;
}

export interface CreatePromoCodeDTO {
    code: string;
    discountPercentage: number;
    expiresAt: string;
    userLimit?: number;
}