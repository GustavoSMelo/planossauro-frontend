interface IUser {
    full_name: string;
    google_email: string | null;
    google_id: number| null;
    google_validation_code: number | null;
    google_is_validated: boolean;
    github_email: string | null;
    github_id: number | null;
    github_is_validated: boolean;
    github_validation_code: number | null;
    cellphone_number: string;
    uuid: string;
    sms_validation_code: number | null;
    sms_is_validated: boolean;
    created_at: Date | string | null;
    updated_at: Date | string | null;
    deleted_at: Date | string | null;
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
    github_validation_code: number;
    google_validation_code: number;
    data: IUser;
}

export type { IUser, ICreateUser, ICreateUserResponse };
