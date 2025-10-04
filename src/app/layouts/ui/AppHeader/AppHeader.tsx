import { useNavigate } from "react-router-dom";
import { useTheme } from "shared/theme";
import { useAuth } from "features/auth";
import style from "./AppHeader.module.css";
import { Dropdown } from "widgets/dropdown";
import type { DropdownProps } from "shared/types";
import { SunIcon, MoonIcon, ProfileIcon, ArrowRepeat, PaintBucketIcon, ToolsIcon, LogoutIcon } from "widgets/icons";

// const pageTitles = {
//     "/all-games": "Все игры",
//     "/games": "Мои игры",
//     "/updates": "Обновления",
//     "/profile": "Профиль",
//     "/admin": "Панель администратора",
// };

export const AppHeader = () => {
    const { theme, setTheme, themes } = useTheme();
    const { logout, isAdmin, checkAdmin } = useAuth();
    const navigate = useNavigate();
    // const location = useLocation();

    // const currentTitle = useMemo(() => {
    //     const path = location.pathname as keyof typeof pageTitles;
    //     return pageTitles[path] || "Главная";
    // }, [location.pathname]);

    const onClickTheme: DropdownProps["onClick"] = ({ key }) => {
        const selectedTheme = themes[Number(key) - 1];
        setTheme(selectedTheme);
    };

    const onClickProfile: DropdownProps["onClick"] = ({ key }) => {
        if (key === 1) navigate("/profile");
        if (key === 2) {
            logout();
            navigate("/login");
        }
        if (key === 3) navigate("/admin");
    };

    if (isAdmin === "") checkAdmin();

    const menuItemsTheme: DropdownProps["options"] = [
        {
            id: 1,
            label: "Светлая тема",
            icon: <SunIcon />,
            extra: theme === "light" && <span className={style["badge"]}></span>,
            active: theme === "light",
        },
        {
            id: 2,
            label: "Темная тема",
            icon: <MoonIcon />,
            extra: theme === "dark" && <span className={style["badge"]}></span>,
            active: theme === "dark",
        },
        {
            type: "divider",
        },
        {
            id: 3,
            label: "Системная тема",
            icon: <ArrowRepeat />,
            extra: theme.includes("system") && <span className={style["badge"]}></span>,
            active: theme.includes("system"),
        },
    ];

    const menuItemsProfile = [
        { id: 1, label: "Информация", icon: <ProfileIcon /> },
        { id: 2, label: "Выход", icon: <LogoutIcon />, danger: true },
    ];

    if (isAdmin) {
        menuItemsProfile.push({
            id: 3,
            label: "Панель администратора",
            icon: <ToolsIcon />,
        });
    }

    return (
        <header className={style.header}>
            <div className={style.header__inner}>
                {/* Бургер + Заголовок */}
                {/* <div className={style.header__group} onClick={() => setDrawerOpen(true)}>
                    <button className={style.iconButton}>
                        <Bars3Icon className={style.icon} />
                    </button>
                    <span className={style.title}>{currentTitle}</span>
                </div> */}

                {/* Настройки */}
                <div className={style.header__group}>
                    <Dropdown options={menuItemsTheme} buttonIcon={<PaintBucketIcon />} onClick={onClickTheme} />
                    <Dropdown options={menuItemsProfile} buttonIcon={<ProfileIcon />} onClick={onClickProfile} />
                </div>
            </div>
        </header>
    );
};
