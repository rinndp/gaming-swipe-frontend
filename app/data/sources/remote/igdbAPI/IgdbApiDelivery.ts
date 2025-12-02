import axios from "axios";
import Constants from "expo-constants";
const IgdbApiDelivery = axios.create({
    baseURL: "https://api.igdb.com/v4/",
    headers: {
        "Content-Type": "text/plain",
        "Client-ID": Constants.expoConfig?.extra?.igdbClientId,
        "Authorization": "Bearer "+Constants.expoConfig?.extra?.igdbAuth,
    },

})

export{IgdbApiDelivery};