import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { useTranslation } from "react-i18next";

export const Lander = () => {
    const navigate = useNavigate();
    const { t } = useTranslation("translation");

    return (
        <div style={{ margin: "0 auto", width: "50%", textAlign: "center" }}>
            <h1>{t("landing.header.text")}</h1>
            <p>{t("landing.info.text")}</p>
            <Button type="primary" onClick={() => navigate("/login")}>{t("landing.button.text")}</Button>
        </div>
    )
};