import axios from "axios";
import { IGDB_CLIENT_ID } from '@env';
import { ApiDelivery } from "../api/ApiDelivery";

let cachedToken: string | null = null;

const IgdbApiDelivery = axios.create({
    baseURL: "https://api.igdb.com/v4/",
    headers: {
        "Content-Type": "text/plain",
        "Client-ID": IGDB_CLIENT_ID,
    },
});

IgdbApiDelivery.interceptors.request.use(async (config) => {
    if (!cachedToken) {
        const response = await ApiDelivery.get('igdb/token');
        cachedToken = response.data.token;
    }
    config.headers.Authorization = "Bearer " + cachedToken;
    return config;
});
export { IgdbApiDelivery };