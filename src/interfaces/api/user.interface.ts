interface IUser {
    full_name: string;
    google_email: string | null;
    github_email: string | null;
    github_id: number | null;
    cellphone_number: string;
    uuid: string;
    is_validated: boolean
}

interface ICreateUser {
    full_name: string;
    google_email: string | null;
    github_email: string | null;
    github_id: number | null;
    cellphone_number: string;
}

interface ICreateUserResponse {
    message: string;
    validation_code: number;
    data: IUser;
}

export type { IUser, ICreateUser, ICreateUserResponse };
