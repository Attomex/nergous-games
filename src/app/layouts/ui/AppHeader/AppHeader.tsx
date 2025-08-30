import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    UserCircleIcon,
    PaintBrushIcon,
    MoonIcon,
    SunIcon,
    InformationCircleIcon,
    ArrowLeftOnRectangleIcon,
    WrenchScrewdriverIcon,
    Bars3Icon,
    Squares2X2Icon,
    ArrowPathIcon,
    BookOpenIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "shared/theme";
import { useAuth } from "features/auth";
import style from "./AppHeader.module.css";
import { createPortal } from "react-dom";

const pageTitles = {
    "/all-games": "Все игры",
    "/games": "Мои игры",
    "/updates": "Обновления",
    "/profile": "Профиль",
    "/admin": "Панель администратора",
};

export const AppHeader = () => {
    const { theme, setTheme, themes } = useTheme();
    const { logout, isAdmin, checkAdmin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

    const currentTitle = useMemo(() => {
        const path = location.pathname as keyof typeof pageTitles;
        return pageTitles[path] || "Главная";
    }, [location.pathname]);

    const onClickTheme = (key: string) => {
        const selectedTheme = themes[Number(key) - 1];
        setTheme(selectedTheme);
        setIsThemeDropdownOpen(false);
    };

    const onClickProfile = (key: string) => {
        if (key === "1") navigate("/profile");
        if (key === "2") {
            logout();
            navigate("/login");
        }
        if (key === "3") navigate("/admin");
        setIsProfileDropdownOpen(false);
    };

    if (isAdmin === "") checkAdmin();

    const iconMenuItems = [
        { key: "/all-games", icon: <Squares2X2Icon />, label: "Все игры" },
        { key: "/games", icon: <BookOpenIcon />, label: "Мои игры" },
        { key: "/updates", icon: <ArrowPathIcon />, label: "Обновления" },
    ];

    const menuItemsTheme = [
        {
            key: "3",
            label: "Светлая тема",
            icon: <SunIcon />,
            active: theme === "light",
        },
        {
            key: "4",
            label: "Темная тема",
            icon: <MoonIcon />,
            active: theme === "dark",
        },
        {
            key: "5",
            label: "Системная тема",
            icon: <UserCircleIcon />,
            active: theme.includes("system"),
        },
    ];

    const menuItemsProfile = [
        { key: "1", label: "Информация", icon: <InformationCircleIcon /> },
        { key: "2", label: "Выход", icon: <ArrowLeftOnRectangleIcon />, danger: true },
    ];

    if (isAdmin) {
        menuItemsProfile.push({
            key: "3",
            label: "Панель администратора",
            icon: <WrenchScrewdriverIcon />,
        });
    }

    return (
        <header className={style.header}>
            <div className={style.header__inner}>
                {/* Бургер + Заголовок */}
                <div className={style.header__group}>
                    <button className={style.iconButton} onClick={() => setDrawerOpen(true)}>
                        <Bars3Icon className={style.icon} />
                    </button>
                    <span className={style.title}>{currentTitle}</span>
                </div>

                {/* Настройки */}
                <div className={style.header__group}>
                    {/* Дропдаун темы */}
                    <div className={style.dropdown}>
                        <button className={style.iconButton} onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}>
                            <PaintBrushIcon className={style.icon} />
                        </button>
                        {isThemeDropdownOpen && (
                            <div className={style.dropdownMenu}>
                                {menuItemsTheme.map((item) => (
                                    <button
                                        key={item.key}
                                        className={`${style.dropdownItem} ${item.active ? style.dropdownItemActive : ""}`}
                                        onClick={() => onClickTheme(item.key)}>
                                        <div className={style.dropdownItemIcon}>{item.icon}</div>
                                        <span>{item.label}</span>
                                        {item.active && <span className={style.badge}></span>}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Дропдаун профиля */}
                    <div className={style.dropdown}>
                        <button className={style.iconButton} onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}>
                            <UserCircleIcon className={style.icon} />
                        </button>
                        {isProfileDropdownOpen && (
                            <div className={style.dropdownMenu}>
                                {menuItemsProfile.map((item) => (
                                    <button
                                        key={item.key}
                                        className={`${style.dropdownItem} ${item.danger ? style.dropdownItemDanger : ""}`}
                                        onClick={() => onClickProfile(item.key)}>
                                        <div className={style.dropdownItemIcon}>{item.icon}</div>
                                        <span>{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Drawer с меню */}
            {drawerOpen &&
                createPortal(
                    <div className={style.drawerOverlay}>
                        <div className={style.drawer}>
                            <div className={style.drawerHeader}>
                                <h2 className={style.drawerTitle}>Меню</h2>
                                <button className={style.iconButton} onClick={() => setDrawerOpen(false)}>
                                    <XMarkIcon className={style.icon} />
                                </button>
                            </div>
                            <nav className={style.drawerBody}>
                                <ul className={style.drawerList}>
                                    {iconMenuItems.map((item) => (
                                        <li key={item.key}>
                                            <button
                                                className={`${style.drawerListItem} ${
                                                    location.pathname === item.key ? style.drawerListItemActive : ""
                                                }`}
                                                onClick={() => {
                                                    navigate(item.key);
                                                    setDrawerOpen(false);
                                                }}>
                                                <div className={style.drawerListItemIcon}>{item.icon}</div>
                                                <span>{item.label}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                                <div className={style.drawerFooter}>
                                    <button
                                        className={`${style.drawerFooterItem} ${location.pathname === "/profile" ? style.drawerListItemActive : ""}`}
                                        onClick={() => {
                                            navigate("/profile");
                                            setDrawerOpen(false);
                                        }}>
                                        <div className={style.drawerListItemIcon}>
                                            <InformationCircleIcon />
                                        </div>
                                        <span>Профиль</span>
                                    </button>
                                    {isAdmin && (
                                        <button
                                            className={`${style.drawerFooterItem} ${
                                                location.pathname === "/admin" ? style.drawerListItemActive : ""
                                            }`}
                                            onClick={() => {
                                                navigate("/admin");
                                                setDrawerOpen(false);
                                            }}>
                                            <div className={style.drawerListItemIcon}>
                                                <WrenchScrewdriverIcon />
                                            </div>
                                            <span>Панель администратора</span>
                                        </button>
                                    )}
                                    <button
                                        className={`${style.drawerFooterItem} ${style.drawerFooterItemDanger}`}
                                        onClick={() => {
                                            logout();
                                            navigate("/login");
                                            setDrawerOpen(false);
                                        }}>
                                        <div className={style.drawerListItemIcon}>
                                            <ArrowLeftOnRectangleIcon />
                                        </div>
                                        <span>Выход</span>
                                    </button>
                                </div>
                            </nav>
                        </div>
                    </div>,
                    document.body
                )}
        </header>
    );
};
