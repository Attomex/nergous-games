import { useNavigate } from "react-router-dom";
import { Button } from "antd";

export const Lander = () => {
    const navigate = useNavigate();

    return (
        <div style={{ margin: "0 auto", width: "50%", textAlign: "center" }}>
            <h1>Добро пожаловать!</h1>
            <p>Чтобы оставаться на связи с нами, пожалуйста, войдите в систему, указав свои персональные данные.</p>
            <Button type="primary" onClick={() => navigate("/login")}>Войти</Button>
        </div>
    )
};