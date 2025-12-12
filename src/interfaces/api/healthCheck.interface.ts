export interface IHealthCheck {
    api: {
        status: number;
        message: string;
    };
    database: {
        status: number;
        message: string;
    }
    github_api: {
        status: number;
        message: string;
    }
};
