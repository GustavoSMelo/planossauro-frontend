import axios from "axios";

const facebookApi = axios.create({
    baseURL: "https://graph.facebook.com",
});

export default facebookApi;
