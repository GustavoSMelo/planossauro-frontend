import type { IUser } from "./api/user.interface";
import type { IAccessSanctumToken } from "./auth.interface";

export interface IFacebookCallback {
    email: string;
    id: string;
    message: string;
    token: IAccessSanctumToken["token"];
    name: string;
    user: IUser;
}
