import axios from "axios";
import {removeUserUseCase} from "../../../../domain/usesCases/user-local/RemoveUser";
import {clearTokens, loadTokens, saveTokens} from "../../local/secure/TokenStorage";
import {useEffect} from "react";

export const API_BASE_URL = "https://gaming-swipe-backend.onrender.com/api/";

const ApiDelivery = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
})

ApiDelivery.defaults.timeout = 10000;

ApiDelivery.interceptors.request.use(async (config) => {
    const creds = await loadTokens();
    if (creds) {
        const { access } = creds;
        config.headers.Authorization = `Bearer ${access}`;
    }
    return config;
});

ApiDelivery.interceptors.response.use(
    successResponse => successResponse,
    async errorResponse => {
        const originalRequest = errorResponse.config;
        if (
            errorResponse.response?.status === 401 &&
            !originalRequest._retry &&
            originalRequest.url !== "/users/token/refresh"
        )  {
            originalRequest._retry = true;

            const tokens = await loadTokens();
            if (!tokens) return Promise.reject(errorResponse);

            try {
                const response = await ApiDelivery.post(
                    "/users/token/refresh",
                    { refresh: tokens.refresh });

                const newAccessToken = response.data.access;
                await saveTokens(response.data.access, response.data.refresh);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return ApiDelivery(originalRequest);
            } catch (refreshError) {
                await removeUserUseCase()
                await clearTokens()
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(errorResponse);
    }
);

export{ApiDelivery};