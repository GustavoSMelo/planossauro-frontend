import type { IUser } from "./api/user.interface";

interface IAccessSanctumToken {
    token: {
        accessToken: {
            name: string;
            tokenable_id: string;
        };
        plainTextToken: string;
    };
    user: IUser;
}

export { type IAccessSanctumToken };
