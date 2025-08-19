import React, { useRef, useState } from "react";
import styles from "./LoginReg.module.css";
import { api } from "shared/api";

interface RegisterFormState {
    email: string;
    password: string;
    steam_url: string;
    image: File | null;
}

export const SignUpForm = () => {
    const inputFile = useRef<HTMLInputElement>(null);
    const [state, setState] = useState<RegisterFormState>({
        email: "",
        password: "",
        steam_url: "",
        image: null,
    });

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

        if(inputFile.current) {
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
                .then((response) => {
                    const data = response.data;
                    alert(data);
                })
                .catch((error) => {
                    throw new Error(error.response.data);
                });

            console.log("Успешная регистрация.");

            resetFields();
        } catch (error) {
            console.error("Ошибка при регистрации:", error);
            resetFields();
        }
    };

    return (
        <div className={styles.loginReg__formContainer + " " + styles.loginReg__signUpContainer}>
            <form className={styles.loginReg__form} onSubmit={handleOnSubmit}>
                <h1 className={styles.loginReg__h1}>Создать аккаунт</h1>
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
                <button className={styles.loginReg__button}>Регистрация</button>
            </form>
        </div>
    );
};
