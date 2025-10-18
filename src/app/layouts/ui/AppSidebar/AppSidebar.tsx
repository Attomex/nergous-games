import React, { useEffect } from "react";
import styles from "./AppSidebar.module.css";
import { useAuth } from "features/auth";
import { IMG_SRC } from "shared/const";
import { useNavigate } from "react-router-dom";
import { showSuccessNotification } from "shared/lib";
import { BookIcon, SquaresIcon, LogoutIcon, ArrowRepeat, XMarkLgIcon } from "widgets/icons";
import { useTranslation } from "react-i18next";
import { Preloader } from "widgets/preloader";

interface AppSidebarProps {
    isMobile: boolean;
    isOpen: boolean;
    closeSidebar: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
    isMobile,
    isOpen,
    closeSidebar,
}) => {
    const { t } = useTranslation("translation");
    const { user, getUserInfo, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            getUserInfo();
        }
    }, [user, getUserInfo]);

    const sidebarItems = [
        { id: 1, icon: <SquaresIcon />, label: t("sidebar.buttons.allGames"), href: "/all-games" },
        { id: 2, icon: <BookIcon />, label: t("sidebar.buttons.myGames"), href: "/games" },
        { id: 3, icon: <ArrowRepeat />, label: t("sidebar.buttons.updates"), href: "/updates" },
    ];

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        showSuccessNotification("Ссылка скопирована в буфер обмена");
    };

    return (
        <>
            <div className={`${styles["app-sidebar"]} ${isMobile ? styles["mobile"] : ""} ${isOpen ? styles["open"] : ""}`}>
                <div className={styles["app-sidebar__content"]}>
                    <section className={styles["app-sidebar__header"]}>
                        <div className={styles["sidebar-item"]}>
                            {user?.photo ? (
                                < img src={`${IMG_SRC}${user?.photo}`} alt={user?.email} className={styles["sidebar-item__img"]} />
                            ) :
                            (
                                <Preloader width="56px" height="56px" borderRadius="8px" />
                            )}
                            <div className={styles["sidebar-user-info"]}>
                                <span className={styles["sidebar-text"]} style={{ color: "var(--gray-medium-color)", cursor: "default" }}>
                                    {user?.email.split("@")[0] || "Username"}
                                </span>
                                <span
                                    className={`${styles["sidebar-text"]} ${styles["sidebar-user-email"]}`}
                                    style={{ cursor: "pointer" }}
                                    onClick={handleCopyLink}
                                >
                                    {user?.email}
                                </span>
                            </div>
                        </div>
                        {isMobile && isOpen && (
                            <span className={styles["sidebar-close"]} onClick={closeSidebar}>
                                <XMarkLgIcon />
                            </span>
                        )}
                    </section>
                    <section className={styles["app-sidebar__body"]}>
                        <ul className={styles["sidebar-list"]}>
                            {sidebarItems.map((item) => (
                                <li
                                    key={item.id}
                                    className={`${styles["sidebar-item"]} ${styles["link"]} ${styles["hover"]}`}
                                    onClick={() => {
                                        navigate(item.href)
                                        closeSidebar();
                                    }}
                                    tabIndex={item.id}
                                >
                                    <span className={styles["sidebar-item__icon"]}>{item.icon}</span>
                                    <span className={styles["sidebar-text"]}>{item.label}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                    <section className={styles["app-sidebar__footer"]}>
                        <div className={`${styles["sidebar-item"]} ${styles["link"]} ${styles["hover"]} ${styles["logout"]}`} onClick={logout} tabIndex={4}>

                            <span className={styles["sidebar-item__icon"]}>
                                <LogoutIcon />
                            </span>
                            <span className={styles["sidebar-text"]}>{t("sidebar.buttons.logout")}</span>
                        </div>
                    </section>
                </div>
            </div>

            <div className={`${styles["backdrop"]}`} onMouseDown={() => isOpen && closeSidebar()}></div>
        </>
    );
};
