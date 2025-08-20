import { useNavigate } from "react-router-dom";
import style from "./AppSidebar.module.css";

export const AppSidebar = () => {
    const navigate = useNavigate();

    return (
        <div className={style.sidebar}>
            <div className={style.menu}>
                <button onClick={() => navigate("/games")}>Страница игр</button>
            </div>
        </div>
    )
};