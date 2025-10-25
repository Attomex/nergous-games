import React, { createContext, useCallback, useContext, useState } from "react";
import Cookies from "js-cookie";
import type { User } from "shared/types";
import { EMPTY_USER } from "shared/const";
import { URL } from "shared/const";
import { showErrorNotification } from "shared/lib";
import api from "shared/api";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
    user: User | null;
    login: (auth_token: string) => void;
    logout: () => void;
    getUserInfo: () => Promise<User>;
    isAdmin: boolean;
    checkAdmin: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    login: () => { },
    logout: () => { },
    getUserInfo: () => Promise.resolve(EMPTY_USER),
    isAdmin: false,
    checkAdmin: () => Promise.resolve(false),
});

interface AuthContextProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthContextProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const navigate = useNavigate();

    const getUserInfo = useCallback(async (): Promise<User> => {


        try {
            const responseInfo = await api.get(`${URL}/games/user/info`);

            const responseStats = await api.get(`${URL}/games/user/stats`);

            const userInfo = responseInfo.data;
            const stats = responseStats.data;

            const userResponse: User = {
                ...userInfo,
                stats: stats,
            };

            if (JSON.stringify(user) !== JSON.stringify(userResponse)) {
                setUser(userResponse);
            }

            setIsAdmin(await checkAdmin());

            return userResponse;
        } catch (error) {
            showErrorNotification(error as string);
            return EMPTY_USER;
        }

    }, [user]);

    const checkAdmin = async (): Promise<boolean> => {
        const token = Cookies.get("auth_token");
        let isAdmin;
        if (token) {
            const user = jwtDecode(token);
            isAdmin = await JSON.parse(JSON.stringify(user)).is_admin;
        }

        return isAdmin;
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
