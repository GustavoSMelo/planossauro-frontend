import axios from "axios";
import { getToken } from "../helpers/token";

const backendURI = `${import.meta.env.VITE_BACKEND_URI}`;
const backendApi = axios.create({
    baseURL: backendURI,
});

backendApi.interceptors.request.use(config => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config
});

export default backendApi;
