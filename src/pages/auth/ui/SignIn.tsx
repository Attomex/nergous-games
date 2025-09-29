import React from "react";
import styles from "./LoginReg.module.css";
import { useAuth } from "features/auth";
import { useNavigate } from "react-router-dom";
import { api } from "shared/api";
import { APP_ID } from "shared/const";
import { showErrorNotification } from "shared/lib";

interface LoginFormState {
    email: string;
    password: string;
    app_id: number | undefined;
}

export const SignInForm = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [state, setState] = React.useState<LoginFormState>({
        email: "",
        password: "",
        app_id: Number(APP_ID)
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setState({
            ...state,
            [event.target.name]: value,
        });
    };

    const handleOnSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const { email, password, app_id } = state;

        try {
            await api().post('/login', { email, password, app_id }).then(
                (response) => {
                    const data = response.data;
                    // console.log(data)
                    login(data);
                    navigate("/games");
                }
            ).catch((error) => {
                throw (error.response.data);
            });
        }
        catch (error) {
            showErrorNotification(error as string);
        }
    };

    return (
        <div className={styles.loginReg__formContainer + " " + styles.loginReg__signInContainer}>
            <form className={styles.loginReg__form} onSubmit={handleOnSubmit}>
                <h1 className={styles.loginReg__h1 + " " + styles.loginReg__h1__signIn}>Авторизация</h1>
                <input
                    className={styles.loginReg__input}
                    type="email"
                    placeholder="Почта"
                    name="email"
                    value={state.email}
                    onChange={handleChange}
                />
                <input
                    className={styles.loginReg__input}
                    type="password"
                    name="password"
                    placeholder="Пароль"
                    value={state.password}
                    onChange={handleChange}
                />
                {/* <a className={styles.loginReg__a} href="#">Забыли свой пароль?</a> */}
                <button className={styles.loginReg__button}>Войти</button>
            </form>
        </div>
    );
}

