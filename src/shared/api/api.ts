import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { URL } from "shared/const";

const axiosPublic = axios.create({
    baseURL: URL,
    withCredentials: true,
});

const logout = () => {
    Cookies.remove("auth_token");
    Cookies.remove("refresh_token");
    window.location.href = "/";
};

const api = axios.create({
    baseURL: URL,
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        const token = Cookies.get("auth_token");
        if (!!token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

let isRefreshing = false;
let failedQueue: { resolve: (value: any) => void; reject: (reason?: any) => void }[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Если токен уже обновляется, добавляем запрос в очередь
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers["Authorization"] = `Bearer ${token}`;
                        return api(originalRequest); // Важно использовать 'api', а не 'axios'
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { data } = await axiosPublic.post<{ access_token: string }>("/refresh");
                const newAccessToken = data.access_token;

                Cookies.set("auth_token", newAccessToken, { expires: 1 / 24 });
                api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

                // Обрабатываем очередь с новым токеном
                processQueue(null, newAccessToken);

                // Повторяем исходный запрос
                return api(originalRequest);
            } catch (refreshError: any) {
                processQueue(refreshError, null);
                logout();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
