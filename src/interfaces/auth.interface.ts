interface IAccessSanctumToken {
    token: {
        accessToken: {
            name: string;
            tokenable_id: string;
        }
        plainTextToken: string;
    }
}

export { type IAccessSanctumToken };
