import styles from "./EmptyItems.module.css";

export const EmptyItems = ({ search }: { search: string }) => {
    const clickOnRepeatSearch = () => {
        document.getElementById("search-input")?.focus();
    };

    return (
        <div className={styles["empty-items__container"]}>
            <img loading="lazy" src="./no-search.png" alt="Ничего не нашлось" className={styles["empty-items__img"]} />
            <p className={styles["empty-items__text"]}>
                По вашему запросу: <span className={styles["empty-items__search"]}>{search}</span> не было найдено ни 1 игры.
            </p>
            <p className={styles["empty-items__text"]}>
                Попробуйте изменить запрос и попробовать{" "}
                <span className={styles["repeat-search"]} onClick={clickOnRepeatSearch}>
                    снова
                </span>
                .
            </p>
        </div>
    );
};
