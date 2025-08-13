import React, { createContext, useContext, useEffect, useState } from "react";
import { itemsTheme } from "../constants/itemsTheme";

type Theme = (typeof itemsTheme)[number];

type ThemeContextType = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    themes: Theme[];
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setCurrentTheme] = useState<Theme>(itemsTheme[0]);

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as Theme | null;
        if (savedTheme && itemsTheme.includes(savedTheme)) {
            setCurrentTheme(savedTheme);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("theme", theme);
        document.body.className = theme;
    }, [theme]);

    const setTheme = (newTheme: Theme) => {
        if (itemsTheme.includes(newTheme)) {
            console.log("newTheme", newTheme);
            setCurrentTheme(newTheme);
        }
    };

    return <ThemeContext.Provider value={{ theme, setTheme, themes: itemsTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
