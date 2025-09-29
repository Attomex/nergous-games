import React, { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { User } from "shared/types";
import { URL } from "shared/const";

interface AuthContextType {
    user: User | null;
    login: (auth_token: string) => void;
    logout: () => void;
    getUserInfo: () => Promise<User>;
    isAdmin: boolean | string;
    checkAdmin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    login: () => {},
    logout: () => {},
    getUserInfo: () => Promise.resolve({ email: "", steam_url: "", photo: "", stats: { finished: 0, playing: 0, planned: 0, dropped: 0 } }),
    isAdmin: false,
    checkAdmin: () => Promise.resolve(),
});

interface AuthContextProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthContextProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean | string>("");

    const getUserInfo = async (): Promise<User> => {
        try {
            const auth_token = Cookies.get("auth_token");
            if (!auth_token) logout();

            const responseInfo = await fetch(`${URL}/games/user/info`, {
                headers: {
                    Authorization: `Bearer ${auth_token}`,
                },
                credentials: "include",
            });
            if (!responseInfo.ok) throw new Error("Ошибка при получении информации о пользователе");

            const responseStats = await fetch(`${URL}/games/user/stats`, {
                headers: {
                    Authorization: `Bearer ${auth_token}`,
                },
                credentials: "include",
            });
            if (!responseStats.ok) throw new Error("Ошибка при получении информации о статистике пользователя");

            const userInfo = await responseInfo.json();
            const stats = await responseStats.json();

            const userResponse: User = {
                ...userInfo,
                isAdmin: userInfo?.isAdmin ? "true" : "false",
                stats: stats,
            };

            setUser(userResponse);
            return userResponse;
        } catch (error) {
            console.error(error);
            return { email: "", steam_url: "", photo: "", stats: { finished: 0, playing: 0, planned: 0, dropped: 0 } };
        }
    };

    const checkAdmin = async (): Promise<void> => {
        try {
            const auth_token = Cookies.get("auth_token");
            if (!auth_token) logout();

            const decodeJWT = jwtDecode(auth_token as string);
            const parseJWT = await JSON.parse(JSON.stringify(decodeJWT));

            setIsAdmin(parseJWT?.is_admin || false);
        } catch (error) {
            console.error(error);
        }
    };

    const login = (auth_token: string): void => {
        Cookies.set("auth_token", auth_token, { expires: 1 / 24 });
        // console.log("success:" + auth_token);
    };

    const logout = (): void => {
        Cookies.remove("auth_token");
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
