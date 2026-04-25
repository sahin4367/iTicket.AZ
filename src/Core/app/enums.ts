
export enum EUserRole {
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


export enum EPaymentStatus {
    PENDING = "PENDING",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED"
}

export interface UpdateUserDTO {
    name  : string;
    surname : string;
    email : string;
    password : string;
    phone : string;
    role : EUserRole;
}

export interface CreatePromoCodeDTO {
    code: string;
    discountPercentage: number;
    expiresAt: string;
    userLimit?: number;
}

export interface ChatMessage {
    username: string;
    message: string;
    imageUrl: string | null;
}