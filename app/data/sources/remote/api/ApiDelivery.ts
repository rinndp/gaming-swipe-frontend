import axios from "axios";
import {removeUserUseCase} from "../../../../domain/usesCases/user-local/RemoveUser";
import {clearTokens, loadTokens, saveTokens} from "../../local/secure/TokenStorage";

export const API_BASE_URL = "https://gaming-swipe-backend.onrender.com/api/";

const ApiDelivery = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
})

ApiDelivery.defaults.timeout = 10000;

// ← Variable para controlar el refresh en progreso
let isRefreshing = false;
let failedQueue: Array<{resolve: (value?: any) => void, reject: (reason?: any) => void}> = [];

// Función para procesar la cola de requests fallidas
const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    
    failedQueue = [];
};

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
            if (isRefreshing) {
                // Si ya hay un refresh en progreso, agrega esta request a la cola
                return new Promise((resolve, reject) => {
                    failedQueue.push({resolve, reject});
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return ApiDelivery(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const tokens = await loadTokens();
            if (!tokens) {
                isRefreshing = false;
                return Promise.reject(errorResponse);
            }

            try {
                const response = await ApiDelivery.post(
                    "/users/token/refresh",
                    { refresh: tokens.refresh }
                );

                const newAccessToken = response.data.access;
                const newRefreshToken = response.data.refresh;
                
                await saveTokens(newAccessToken, newRefreshToken);
                
                // Actualiza el header de la request original
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                
                // Procesa todas las requests en la cola con el nuevo token
                processQueue(null, newAccessToken);
                
                isRefreshing = false;
                
                // Reintenta la request original
                return ApiDelivery(originalRequest);
                
            } catch (refreshError: any) {
                processQueue(refreshError, null);
                isRefreshing = false;
                
                // Si el refresh token también falló, cierra sesión
                if (refreshError.response?.data?.code === "token_not_valid" || 
                    refreshError.response?.data?.detail === "Token is blacklisted") {
                    await removeUserUseCase();
                    await clearTokens();
                }
                
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(errorResponse);
    }
);

export{ApiDelivery};