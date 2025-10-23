import React, { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";
// import { jwtDecode } from "jwt-decode";
import type { User } from "shared/types";
import { URL } from "shared/const";
import { showErrorNotification } from "shared/lib";
import api from "shared/api";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
    user: User | null;
    login: (auth_token: string) => void;
    logout: () => void;
    getUserInfo: () => Promise<User>;
    isAdmin: boolean | string;
    checkAdmin: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    login: () => {},
    logout: () => {},
    getUserInfo: () => Promise.resolve({ email: "", steam_url: "", photo: "", stats: { finished: 0, playing: 0, planned: 0, dropped: 0 }, isAdmin: "false" }),
    isAdmin: false,
    checkAdmin: () => Promise.resolve(false),
});

interface AuthContextProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthContextProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean | string>("");
    const navigate = useNavigate();

    const getUserInfo = async (): Promise<User> => {
        try {
            const responseInfo = await api.get(`${URL}/games/user/info`);

            const responseStats = await api.get(`${URL}/games/user/stats`);

            const userInfo = responseInfo.data;
            const stats = responseStats.data;

            const userResponse: User = {
                ...userInfo,
                isAdmin: userInfo?.isAdmin ? "true" : "false",
                stats: stats,
            };

            setIsAdmin(userInfo?.isAdmin ? "true" : "false");

            setUser(userResponse);
            return userResponse;
        } catch (error) {
            showErrorNotification(error as string);
            return { email: "", steam_url: "", photo: "", stats: { finished: 0, playing: 0, planned: 0, dropped: 0 }, isAdmin: "false" };
        }
    };

    const checkAdmin = async (): Promise<boolean> => {
        return isAdmin === "true" ? true : false;
    };

    const login = (auth_token: string): void => {
        Cookies.set("auth_token", auth_token, { expires: 1 / 24 });
    };

    const logout = async (): Promise<void> => {
        await api.post("/logout");
        Cookies.remove("auth_token");
        setUser(null);
        navigate("/");
    };

    return <AuthContext.Provider value={{ user, login, logout, getUserInfo, isAdmin, checkAdmin }}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
