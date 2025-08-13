import React, { useState } from "react";
import styles from "./LoginReg.module.css";
import SignInForm from "./SignIn";
import SignUpForm from "./SignUp";

const LoginRegPage = () => {
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
                            <h1 className={styles.loginReg__h1}>Добро пожаловать!</h1>
                            <p className={styles.loginReg__p}>
                                Чтобы оставаться на связи с нами, пожалуйста, войдите в систему, указав свои персональные данные.
                            </p>
                            <button
                                className={`${styles.loginReg__button} ${styles.loginReg__ghost}`}
                                id="signIn"
                                onClick={() => handleOnClick("signIn")}
                            >
                                Войти
                            </button>
                        </div>
                        <div className={`${styles.loginReg__overlayPanel} ${styles.loginReg__overlayRight}`}>
                            <h1 className={styles.loginReg__h1}>Привет, друзья!</h1>
                            <p className={styles.loginReg__p}>Введите свои персональные данные и начните путешествие с нами.</p>
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

export default LoginRegPage;
