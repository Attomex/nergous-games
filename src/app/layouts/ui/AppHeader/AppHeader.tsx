import { useNavigate } from "react-router-dom";
import { useTheme } from "shared/theme";
import { useAuth } from "features/auth";
import style from "./AppHeader.module.css";
import { Dropdown } from "widgets/dropdown";
import type { DropdownProps } from "shared/types";
import { SunIcon, MoonIcon, ProfileIcon, ArrowRepeat, PaintBucketIcon, ToolsIcon, LogoutIcon, TranslateIcon, MenuIcon } from "widgets/icons";
import { useTranslation } from "react-i18next";
import { AppSidebar } from "../AppSidebar";
import { useMediaQuery } from "shared/hooks";
import { useState } from "react";

// const pageTitles = {
//     "/all-games": "Все игры",
//     "/games": "Мои игры",
//     "/updates": "Обновления",
//     "/profile": "Профиль",
//     "/admin": "Панель администратора",
// };

export const AppHeader = () => {
    const { theme, setTheme, themes } = useTheme();
    const { logout, isAdmin } = useAuth();
    const { t, i18n } = useTranslation();

    const [isOpenSidebar, setIsOpenSidebar] = useState(false);
    const isMobile = useMediaQuery("(max-width: 660px)");
    const navigate = useNavigate();

    const onClickLocal: DropdownProps["onClick"] = ({ value }) => {
        localStorage.setItem("local", value as string);
        switch (value) {
            case "ru-RU":
                i18n.changeLanguage(value);
                break;
            case "en-US":
                i18n.changeLanguage(value);
                break;
        }
    };

    const onClickTheme: DropdownProps["onClick"] = ({ key }) => {
        const selectedTheme = themes[Number(key) - 1];
        setTheme(selectedTheme);
    };

    const onClickProfile: DropdownProps["onClick"] = ({ key }) => {
        if (key === 1) navigate("/profile");
        if (key === 2) {
            logout();
            navigate("/");
        }
        if (key === 3) navigate("/admin");
    };

    // if (isAdmin === "") checkAdmin();

    const menuItemsTheme: DropdownProps["options"] = [
        {
            id: 1,
            label: t("appHeader.theme.light"),
            icon: <SunIcon />,
            extra: theme === "light" && <span className={style["badge"]}></span>,
            active: theme === "light",
        },
        {
            id: 2,
            label: t("appHeader.theme.dark"),
            icon: <MoonIcon />,
            extra: theme === "dark" && <span className={style["badge"]}></span>,
            active: theme === "dark",
        },
        {
            type: "divider",
        },
        {
            id: 3,
            label: t("appHeader.theme.system"),
            icon: <ArrowRepeat />,
            extra: theme.includes("system") && <span className={style["badge"]}></span>,
            active: theme.includes("system"),
        },
    ];

    const menuItemsProfile = [
        { id: 1, label: t("appHeader.settings.profile"), icon: <ProfileIcon /> },
        { id: 2, label: t("appHeader.settings.logout"), icon: <LogoutIcon />, danger: true },
    ];

    const localItems: DropdownProps["options"] = [
        {
            id: 1,
            label: "Русский",
            value: "ru-RU",
            extra: i18n.language === "ru-RU" && <span className={style["badge"]}></span>,
            active: i18n.language === "ru-RU",
        },
        {
            id: 2,
            label: "English",
            value: "en-US",
            extra: i18n.language === "en-US" && <span className={style["badge"]}></span>,
            active: i18n.language === "en-US",
        },
    ];

    if (isAdmin) {
        menuItemsProfile.push({
            id: 3,
            label: t("appHeader.settings.admin-users"),
            icon: <ToolsIcon />,
        });
    }

    return (
        <>
            <header className={style.header}>
                <div className={style.header__inner}>
                    {/* Бургер + Заголовок */}
                    {isMobile && (
                        <div className={style["header__burger-icon"]} onClick={() => setIsOpenSidebar(true)}>
                            <MenuIcon />
                        </div>
                    )}

                    {/* Настройки */}
                    <div className={style.header__group}>
                        <Dropdown options={localItems} buttonIcon={<TranslateIcon />} onClick={onClickLocal} />
                        <Dropdown options={menuItemsTheme} buttonIcon={<PaintBucketIcon />} onClick={onClickTheme} />
                        <Dropdown options={menuItemsProfile} buttonIcon={<ProfileIcon />} onClick={onClickProfile} />
                    </div>
                </div>
            </header>
            <AppSidebar isMobile={isMobile} isOpen={isOpenSidebar} closeSidebar={() => setIsOpenSidebar(false)} />
        </>
    );
};
