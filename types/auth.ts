import { IUser } from "./user";

export interface AuthResponse {
    accessToken: string;
    refreshToken?: string; // if your backend sends refresh token
    user: IUser;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload extends Partial<IUser> { }

