import { useLayoutEffect, useState } from "react";
import styles from "./LoginReg.module.css";
import { SignInForm } from "./SignIn";
import { SignUpForm } from "./SignUp";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export const LoginRegPage = () => {
    const [type, setType] = useState("signIn");
    const { t } = useTranslation("translation");

    const navigate = useNavigate();
    
    const handleOnClick = (text: string) => {
        if (text !== type) {
            setType(text);
        }
    };

    useLayoutEffect(() => {
        if(Cookies.get("auth_token")) {
            navigate("/games");
        }
    }, [])

    const containerClass = [styles.loginReg__container, type === "signUp" ? styles.loginReg__rightPanelActive : ""].join(" ");

    return (
        <div className={styles.loginReg__root}>
            <div className={containerClass} id="container">
                <SignUpForm />
                <SignInForm />
                <div className={styles.loginReg__overlayContainer}>
                    <div className={styles.loginReg__overlay}>
                        <div className={`${styles.loginReg__overlayPanel} ${styles.loginReg__overlayLeft}`}>
                            <h1 className={styles.loginReg__h1}>{t("loginReg.registration.side-title")}</h1>
                            <p className={styles.loginReg__p}>{t("loginReg.registration.side-text")}</p>
                            <button
                                className={`${styles.loginReg__button} ${styles.loginReg__ghost}`}
                                id="signIn"
                                onClick={() => handleOnClick("signIn")}
                            >
                                {t("loginReg.registration.side-button")}
                            </button>
                        </div>
                        <div className={`${styles.loginReg__overlayPanel} ${styles.loginReg__overlayRight}`}>
                            <h1 className={styles.loginReg__h1}>{t("loginReg.login.side-title")}</h1>
                            <p className={styles.loginReg__p}>
                                {t("loginReg.login.side-text")}
                            </p>
                            <button
                                className={`${styles.loginReg__button} ${styles.loginReg__ghost}`}
                                id="signUp"
                                onClick={() => handleOnClick("signUp")}
                            >
                                {t("loginReg.login.side-button")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
