import type { ICreateUser } from "../interfaces/api/user.interface";
import backendApi from "./api";

const createUser = (data: ICreateUser) => {
    try {
        return backendApi.post('/user', data);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error creating user:', error);
    }
};

export { createUser };
