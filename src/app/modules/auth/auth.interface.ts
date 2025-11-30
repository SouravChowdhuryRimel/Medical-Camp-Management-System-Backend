export type TAccount = {
    name: string;
    email: string;
    password: string;
    lastPasswordChange?: Date;
    image?: string;
    isDeleted?: boolean;
    accountStatus?: "ACTIVE" | "INACTIVE" | "SUSPENDED";
    role?: "USER" | "ADMIN" | "VOLUNTEER" | "CLINICIAN" | "SuperAdmin";
    isVerified?: boolean;
    otp?: string | null;
    otpExpiry?: Date | null;
    otpExpiresAt?: Date | null;
}


export interface TRegisterPayload extends TAccount {
    
}

export type TLoginPayload = {
    email: string;
    password: string;
}

export type TJwtUser = {
    email: string;
    role?: "USER" | "ADMIN" | "VOLUNTEER" | "CLINICIAN" | "SuperAdmin";
}