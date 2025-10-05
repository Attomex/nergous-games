import { useTranslation } from "react-i18next";
import styles from "./EmptyItems.module.css";

export const EmptyItems = () => {
    const { t } = useTranslation("translation", {keyPrefix: "emptyResult"});
    const clickOnRepeatSearch = () => {
        document.getElementById("search-input")?.focus();
    };

    return (
        <div className={styles["empty-items__container"]}>
            <img loading="lazy" src="./no-search.png" alt="Ничего не нашлось" className={styles["empty-items__img"]} />
            <p className={styles["empty-items__text"]}>
                {t("f-text")}
            </p>
            <p className={styles["empty-items__text"]}>
                {t("s-text")}{" "}
                <span className={styles["repeat-search"]} onClick={clickOnRepeatSearch}>
                    {t("again-text")}
                </span>
                .
            </p>
        </div>
    );
};
