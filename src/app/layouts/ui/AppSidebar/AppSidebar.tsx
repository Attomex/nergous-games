import { useEffect } from "react";
import styles from "./AppSidebar.module.css";
import { useAuth } from "features/auth";
import { IMG_SRC } from "shared/const";
import { useNavigate } from "react-router-dom";
import { showSuccessNotification } from "shared/lib";
import { BookIcon, SquaresIcon, LogoutIcon, ArrowRepeat } from "widgets/icons";

export const AppSidebar = () => {

    const { user, getUserInfo, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            getUserInfo();
        }
    }, [user, getUserInfo]);

    const sidebarItems = [
        { id: 1, icon: <SquaresIcon />, label: "Все игры", href: "/all-games" },
        { id: 2, icon: <BookIcon />, label: "Мои игры", href: "/games" },
        { id: 3, icon: <ArrowRepeat />, label: "Обновления", href: "/updates" },
    ];

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        showSuccessNotification("Ссылка скопирована в буфер обмена");
    };

    return (
        <>
            <div className={styles["app-sidebar"]}>
                <div className={styles["app-sidebar__content"]}>
                    <section className={styles["app-sidebar__header"]}>
                        <div className={styles["sidebar-item"]}>
                            <img src={`${IMG_SRC}${user?.photo}`} alt={user?.email} className={styles["sidebar-item__img"]} />
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
                    </section>
                    <section className={styles["app-sidebar__body"]}>
                        <ul className={styles["sidebar-list"]}>
                            {sidebarItems.map((item) => (
                                <li
                                    key={item.id}
                                    className={`${styles["sidebar-item"]} ${styles["link"]} ${styles["hover"]}`}
                                    onClick={() => navigate(item.href)}
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
                            {/* Здесь может быть иконка выхода или настроек */}
                            <span className={styles["sidebar-item__icon"]}>
                                <LogoutIcon />
                            </span>
                            <span className={styles["sidebar-text"]}>Выход</span>
                        </div>
                    </section>
                </div>
            </div>
            {/* Этот backdrop теперь не нужен, так как эффект наведения управляется только через сайдбар */}
            <div className={`${styles["backdrop"]}`}>backdrop</div>
        </>
    );
};
