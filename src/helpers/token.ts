const setToken = (token: string): void => {
    sessionStorage.setItem('@auth/token', token);
};

const getToken = (): string => {
    const token = sessionStorage.getItem('@auth/token') || '';
    return token;
};

export { setToken, getToken };
