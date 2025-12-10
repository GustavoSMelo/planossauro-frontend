interface IGithubCallbackResponse {
    accessToken: string;
    data: {
        email: string;
        id: number;
        name: string;
        login: string;
    }
}

export type { IGithubCallbackResponse };
