interface IUser {
    full_name: string;
    google_email: string | null;
    github_email: string | null;
    github_id: number | null;
    cellphone_number: string;
    uuid: string;
}

export type { IUser };
