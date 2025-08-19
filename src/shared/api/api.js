import axios from "axios";
import Cookies from "js-cookie";

const url = process.env.REACT_APP_API_URL;

const logout = () => {
    Cookies.remove("auth_token");
    window.location.href = "/login";
};

export const api = () => {
    const api = axios.create({
        baseURL: url,
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

    api.interceptors.response.use(
        (response) => response,
        (error) => {
            console.log(error);

            if (error.response.status === 401 || error.response.message === "unauthorized") {
                logout();

                return Promise.reject(error);
            }

            return Promise.reject(error);
        }
    );

    return api;
};
