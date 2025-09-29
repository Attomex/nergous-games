import { useState } from "react";
import styles from "./LoginReg.module.css";
import { SignInForm } from "./SignIn";
import { SignUpForm } from "./SignUp";

export const LoginRegPage = () => {
    const [type, setType] = useState("signIn");
    const handleOnClick = (text: string) => {
        if (text !== type) {
            setType(text);
        }
    };

    const containerClass = [styles.loginReg__container, type === "signUp" ? styles.loginReg__rightPanelActive : ""].join(" ");

    return (
        <div className={styles.loginReg__root}>
            <div className={containerClass} id="container">
                <SignUpForm />
                <SignInForm />
                <div className={styles.loginReg__overlayContainer}>
                    <div className={styles.loginReg__overlay}>
                        <div className={`${styles.loginReg__overlayPanel} ${styles.loginReg__overlayLeft}`}>
                            <h1 className={styles.loginReg__h1}>Вход в аккаунт</h1>
                            <p className={styles.loginReg__p}>Уже есть учетная запись? Просто войдите, и вы в деле.</p>
                            <button
                                className={`${styles.loginReg__button} ${styles.loginReg__ghost}`}
                                id="signIn"
                                onClick={() => handleOnClick("signIn")}
                            >
                                Войти
                            </button>
                        </div>
                        <div className={`${styles.loginReg__overlayPanel} ${styles.loginReg__overlayRight}`}>
                            <h1 className={styles.loginReg__h1}>Один аккаунт для всего!</h1>
                            <p className={styles.loginReg__p}>
                                Зарегистрируйтесь, чтобы получить доступ ко всем нашим сервисам с единой учетной записью.
                            </p>
                            <button
                                className={`${styles.loginReg__button} ${styles.loginReg__ghost}`}
                                id="signUp"
                                onClick={() => handleOnClick("signUp")}
                            >
                                Регистрация
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
