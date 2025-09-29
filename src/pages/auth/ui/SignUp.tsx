import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginReg.module.css";
import { api } from "shared/api";
import { APP_ID } from "shared/const";
import { useAuth } from "features/auth";
import { showErrorNotification, showSuccessNotification } from "shared/lib";

interface RegisterFormState {
    email: string;
    password: string;
    steam_url: string;
    image: File | null;
}

export const SignUpForm = () => {
    const inputFile = useRef<HTMLInputElement>(null);
    const { login } = useAuth();
    const navigate = useNavigate();
    const [state, setState] = useState<RegisterFormState>({
        email: "",
        password: "",
        steam_url: "",
        image: null,
    });

    const [redirect, setRedirect] = useState<boolean>(false);
    const [timerRedirect, setTimerRedirect] = useState<number>(0);

    useEffect(() => {
        if (redirect && timerRedirect > 0) {
            const id = setInterval(() => {
                setTimerRedirect((prev) => prev - 1);
            }, 1000);

            return () => clearInterval(id);
        } else if (timerRedirect === 0 && redirect) {
            navigate("/games");
        }
    }, [timerRedirect, redirect]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.name === "image" && event.target.files && event.target.files.length > 0) {
            setState({
                ...state,
                image: event.target.files[0],
            });
        } else {
            const value = event.target.value;
            setState({
                ...state,
                [event.target.name]: value,
            });
        }
    };

    const resetFields = () => {
        setState({
            email: "",
            password: "",
            steam_url: "",
            image: null,
        });

        if (inputFile.current) {
            inputFile.current.value = "";
        }
    };

    const handleOnSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("email", state.email);
        formData.append("password", state.password);
        formData.append("steam_url", state.steam_url);
        if (state.image) {
            formData.append("image", state.image);
        }

        try {
            await api()
                .post("/register", formData)
                .catch((error) => {
                    throw error.response.data;
                });

            const email = formData.get("email");
            const password = formData.get("password");

            await api()
                .post("/login", { email, password, app_id: Number(APP_ID) })
                .then((response) => {
                    login(response.data);
                    setRedirect(true);
                    setTimerRedirect(3);
                    showSuccessNotification("Вы успешно зарегистрировались! Перенаправление через 3 секунды...");
                })
                .catch((error) => {
                    throw error.response.data;
                });
        } catch (error) {
            showErrorNotification(`Ошибка при регистрации: ${error as string}`);
        } finally {
            resetFields();
        }
    };

    return (
        <div className={styles.loginReg__formContainer + " " + styles.loginReg__signUpContainer}>
            <form className={styles.loginReg__form} onSubmit={handleOnSubmit}>
                <h1 className={styles.loginReg__h1 + " " + styles.loginReg__h1__signUp}>Регистрация</h1>
                <input
                    className={styles.loginReg__input}
                    type="email"
                    name="email"
                    value={state.email}
                    onChange={handleChange}
                    placeholder="Почта"
                    required
                />
                <input
                    className={styles.loginReg__input}
                    type="password"
                    name="password"
                    value={state.password}
                    onChange={handleChange}
                    placeholder="Пароль"
                    required
                />
                <input
                    className={styles.loginReg__input}
                    type="url"
                    name="steam_url"
                    value={state.steam_url}
                    onChange={handleChange}
                    placeholder="URL на профиль Steam"
                    required
                />
                <input
                    className={styles.loginReg__input}
                    type="file"
                    name="image"
                    accept=".jpg, .jpeg, .png"
                    onChange={handleChange}
                    ref={inputFile}
                    required
                />
                {redirect ? (
                    <button className={styles.loginReg__button} disabled>
                        {timerRedirect > 1 ? "Перенаправление через " + timerRedirect + " секунд..." : "Перенаправление..."}
                    </button>
                ) : (
                    <button className={styles.loginReg__button}>Регистрация</button>
                )}
            </form>
        </div>
    );
};
