import React, { useState } from "react";
import styles from "./GameCard.module.css";
import { gameStatuse } from "shared/const";
import { GameInfo } from "shared/types";
import { api } from "shared/api";
import { EditGameInfoModal } from "features/edit-game";
import { showErrorNotification, showSuccessNotification } from "shared/lib";
import { statsColors } from "shared/const";
import { useAuth } from "features/auth";
import { EditIcon, WikipediaIcon, SteamIcon } from "widgets/icons";
import { CustomRate } from "widgets/rate";
import { CustomDropdown } from "widgets/dropdown";
import { IMG_SRC } from "shared/const";
import { EyeIcon } from "widgets/icons";
import { useTranslation } from "react-i18next";

interface GameCardProps {
    gameInfo: GameInfo;
    updateUsersGames: () => void;
    openDetails: (gameInfo: GameInfo) => void
}

export const GameCard: React.FC<GameCardProps> = ({ gameInfo, updateUsersGames, openDetails }) => {
    const [newPriority, setNewPriority] = useState(gameInfo.priority / 2);
    const [willUpdate, setWillUpdate] = useState(false);
    const { isAdmin } = useAuth();
    const { t } = useTranslation("translation");
    // const key = gameInfo.status as keyof typeof gameStatuse;
    const textStatus = `gameCard.status.${gameInfo.status ? gameInfo.status : "no-select"}`;
    const status = t(textStatus as any);

    // Открытие модалки для изменения инфы об игре
    const [editGameInfoModal, setEditGameInfoModal] = useState(false);

    // Изменение приоритета
    const changePriority = (value: number) => {
        setNewPriority(value);
        // gameInfo.priority = value;
        setWillUpdate(true);
    };

    const updatePriority = async () => {
        // alert(`Было обновлено! Было ${gameInfo.priority}, стало ${newPriority * 2}`);
        // console.log(newPriority);
        await updateGame("priority", newPriority * 2);
        setWillUpdate(false);
    };

    const onChangeStatus = ({ id }: { id: number }) => {
        const keysStatuses = Object.keys(gameStatuse);
        const keyStatus = keysStatuses[id - 1];
        updateGame("status", keyStatus);
    };
    

    const statuses = [
        {
            id: 1,
            label: t("gameCard.status.planned"),
            extra: <span className={`${styles["status-badge"]} ${styles.planned}`}></span>,
        },
        {
            id: 2,
            label: t("gameCard.status.playing"),
            extra: <span className={`${styles["status-badge"]} ${styles.processing}`}></span>,
        },
        {
            id: 3,
            label: t("gameCard.status.finished"),
            extra: <span className={`${styles["status-badge"]} ${styles.finished}`}></span>,
        },
        {
            id: 4,
            label: t("gameCard.status.dropped"),
            extra: <span className={`${styles["status-badge"]} ${styles.dropped}`}></span>,
        },
    ];

    const updateGame = async (key: string, value: string | number) => {
        try {
            await api()
                .put(`/games/${gameInfo.id}/${key}`, {
                    ...gameInfo,
                    [key]: value,
                })
                .then(() => {
                    showSuccessNotification(`Было обновлено! Обновлено ${key} на ${value}`);
                });
        } catch (err) {
            showErrorNotification(err as string);
            setNewPriority(gameInfo.priority);
        }

        updateUsersGames();
    };

    const getColor = (status: string): string => {
        switch (status) {
            case "planned":
                return statsColors.planned;
            case "playing":
                return statsColors.playing;
            case "finished":
                return statsColors.finished;
            case "dropped":
                return statsColors.dropped;
            default:
                return "gray";
        }
    };

    const getColorSource = (url: string): { color: string; source: string } => {
        const set = {
            color: "",
            source: "",
        };
        if (url.includes("wikipedia")) {
            // set.color = "#f3956a";
            set.color = "#3366ccff";
            set.source = "wikipedia";
        } else if (url.includes("steampowered")) {
            // set.color = "#bfbfbf";
            set.color = "#171a21";
            set.source = "steam";
        } else {
            set.color = "#0facb8ff";
            // set.color = "#8e44ad";
            set.source = "other";
        }

        return set;
    };

    const set = getColorSource(gameInfo.url);

    return (
        <article className={styles.card}>
            {/* Левый столбец — изображение */}
            <div className={styles.image} onClick={() => openDetails(gameInfo)}>
                <img loading="lazy" src={IMG_SRC + gameInfo.image} alt={gameInfo.title} />

                {/* Поверхностные кнопачки */}
                {isAdmin && (
                    <div
                        className={styles.editGame}
                        onClick={(e) => {
                            e.stopPropagation();
                            setEditGameInfoModal(true);
                        }}
                    >
                        {/* <div  className={styles.editGame__icon}> */}
                        <EditIcon />
                        {/* </div> */}
                    </div>
                )}

                <div className={styles.eye}>
                    <EyeIcon w="48px" h="48px" />
                </div>

                <div className={styles.status__tag}>
                    <span
                        className={styles.tag}
                        style={{
                            backgroundColor: getColor(gameInfo.status),
                            borderColor: getColor(gameInfo.status),
                        }}
                    >
                        {status !== undefined ? status : t("gameCard.status.no-select")}
                    </span>
                </div>

                <div className={styles.source}>
                    <a
                        className={styles.tag}
                        style={{
                            backgroundColor: set.color,
                            borderColor: set.color,
                        }}
                        href={gameInfo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Ссылка на сайт"
                        onClick={(e) => e.stopPropagation()}
                        tabIndex={-1}
                    >
                        {set.source === "wikipedia" ? <WikipediaIcon /> : set.source === "steam" ? <SteamIcon /> : <></>}
                        {" " + set.source}
                    </a>
                </div>
            </div>

            <div className={styles.details}>
                <div className={styles.header__wrapper}>
                    <header className={styles.title}>{gameInfo.title}</header>
                    <div className={styles.year}>{gameInfo.year || t("gameCard.year.no-year")}</div>
                </div>

                <div className={styles.genres}>{gameInfo.genre.replace(/,\s*/g, " / ")}</div>

                <hr className={styles.divider} />

                <div className={styles.rating__year}>
                    {/* Добавляем пустой контейнер для сохранения пространства слева */}
                    <div className={styles.rating__container}>
                        {status !== undefined && (
                            <div className={styles.rating}>
                                <div className={styles.rating__content}>
                                    <span className={styles.priority__text}>{t("gameCard.priority.text")}</span>
                                    <CustomRate
                                        className={styles.rating__rate}
                                        allowHalf={true}
                                        defaultValue={gameInfo.priority / 2}
                                        onChange={changePriority}
                                    />
                                </div>
                                <div onClick={updatePriority} className={styles.rating__update__container}>
                                    <span className={`${willUpdate ? styles.rating__update : styles.rating__update__hidden} ${styles.tag}`}>
                                        {t("gameCard.priority.update")}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <CustomDropdown buttonClassName={styles["status-change"]} dropdownClassName={styles["status-change__dropdown"]} items={statuses} initialSelectedItem={status} onChange={(id) => onChangeStatus(id)} />
            </div>
            <EditGameInfoModal
                gameInfo={gameInfo}
                updateUsersGames={updateUsersGames}
                isModalOpen={editGameInfoModal}
                closeModal={() => setEditGameInfoModal(false)}
            />
        </article>
    );
};
