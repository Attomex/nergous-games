import React, { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";

const url = process.env.REACT_APP_API_URL;


export interface User {
    email: string;
    steam_url: string;
    photo: string;
}

interface AuthContextType {
    user: User | null;
    login: (auth_token: string) => void;
    logout: () => void;
    getUserInfo: () => Promise<User>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    login: () => {},
    logout: () => {},
    getUserInfo: () => Promise.resolve({ email: "", steam_url: "", photo: "" }),
});

interface AuthContextProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthContextProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const getUserInfo = async (): Promise<User> => {
        // if (user !== null) return true;

        try {
            const auth_token = Cookies.get("auth_token");
            if (!auth_token) logout();

            const response = await fetch(`${url}/games/user/info`, {
                headers: {
                    Authorization: `Bearer ${auth_token}`,
                },
                credentials: "include",
            });

            if (!response.ok) throw new Error("Ошибка при получении информации о пользователе");

            const userInfo = await response.json();
            // console.log(userInfo);
            setUser(userInfo);
            return userInfo;
        } catch (error) {
            console.error(error);
            return { email: "", steam_url: "", photo: "" };
        }
    };

    const login = (auth_token: string): void => {
        Cookies.set("auth_token", auth_token, { expires: 1 / 24 });
        // console.log("success:" + auth_token);
    };

    const logout = (): void => {
        Cookies.remove("auth_token");
    };

    return <AuthContext.Provider value={{ user, login, logout, getUserInfo }}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
