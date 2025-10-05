import axios from "axios";
import Cookies from "js-cookie";
import { URL } from "shared/const";

const axiosPublic = axios.create({
    baseURL: URL,
    withCredentials: true,
})

const logout = () => {
    Cookies.remove("auth_token");
    Cookies.remove("refresh_token");
    window.location.href = "/login";
};

export const api = () => {
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
    let failedQueue: any[] = [];

    const processQueue = (error: any, token = null) => {
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
        async (error) => {
            const originalRequest = error.config;

            if (error.response.status === 401 && !originalRequest._retry) {
                if (isRefreshing) {
                    return new Promise(function (resolve, reject) {
                        failedQueue.push({ resolve, reject });
                    }).then((token) => {
                        originalRequest.headers["Authorization"] = `Bearer ${token}`;
                        return axios(originalRequest);
                    }).catch((err) => {
                        return Promise.reject(err);
                    });
                }
                
                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    const refreshToken = Cookies.get("refresh_token");
                    const { data } = await axiosPublic.post("/auth/refresh", { refreshToken });

                    Cookies.set("auth_token", data.accessToken);
                    Cookies.set("refresh_token", data.refreshToken);

                    api.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;
                    originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;

                    processQueue(null, data.accessToken);

                    return api(originalRequest);
                } catch (refreshError) {
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

    return api;
};
