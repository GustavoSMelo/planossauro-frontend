import axios from "axios";

const backendURI = `${import.meta.env.VITE_BACKEND_URI}`;
const backendApi = axios.create({
    baseURL: backendURI,
});

export default backendApi;
