interface IGithubCallbackResponse {
    accessToken: string;
    data: {
        email: string;
        id: number;
        name: string;
    }
}

export type { IGithubCallbackResponse };
