import axios from "axios";
import { IGDB_CLIENT_ID, IGDB_AUTH } from '@env';

const IgdbApiDelivery = axios.create({
    baseURL: "https://api.igdb.com/v4/",
    headers: {
        "Content-Type": "text/plain",
        "Client-ID": IGDB_CLIENT_ID,
        "Authorization": "Bearer " + IGDB_AUTH,
    },
})

export { IgdbApiDelivery };