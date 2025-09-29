import React, { useState } from "react";
import styles from "./GameCard.module.css";
import { gameStatuse } from "shared/const";
import { GameInfo } from "shared/types";
import { api } from "shared/api";
import { EditGameInfoModal } from "features/edit-game";
import { showErrorNotification, showSuccessNotification } from "shared/lib";
import { statsColors } from "shared/const";
import { useAuth } from "features/auth";
import { GameDetailModal } from "./GameDetailModal";
import { EditIcon, WikipediaIcon, SteamIcon } from "widgets/icons";
import { CustomRate } from "widgets/rate";
import { CustomDropdown } from "widgets/dropdown";
import { IMG_SRC } from "shared/const";

interface GameCardProps {
    gameInfo: GameInfo;
    updateUsersGames: () => void;
}

export const GameCard: React.FC<GameCardProps> = ({ gameInfo, updateUsersGames }) => {
    const key = gameInfo.status as keyof typeof gameStatuse;
    const status = gameStatuse[key];
    const [newPriority, setNewPriority] = useState(gameInfo.priority / 2);
    const [willUpdate, setWillUpdate] = useState(false);
    const { isAdmin } = useAuth();
    const [gameDetails, setGameDetails] = useState(false);

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
            label: "В планах",
            extra: <span className={`${styles["status-badge"]} ${styles.planned}`}></span>,
        },
        {
            id: 2,
            label: "В процессе",
            extra: <span className={`${styles["status-badge"]} ${styles.processing}`}></span>,
        },
        {
            id: 3,
            label: "Завершен",
            extra: <span className={`${styles["status-badge"]} ${styles.finished}`}></span>,
        },
        {
            id: 4,
            label: "Брошено",
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
            set.color = "#3366cc";
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
        <div className={styles.card}>
            {/* Левый столбец — изображение */}
            <div className={styles.image} onClick={() => setGameDetails(true)}>
                <img src={IMG_SRC + gameInfo.image} alt={gameInfo.title} />

                {/* Поверхностные кнопачки */}
                {isAdmin && (
                    <div className={styles.editGame}>
                        <div onClick={() => setEditGameInfoModal(true)} className={styles.editGame__icon}>
                            <EditIcon />
                        </div>
                    </div>
                )}

                <div className={styles.status__tag}>
                    <span
                        className={styles.tag}
                        style={{
                            backgroundColor: getColor(gameInfo.status),
                            borderColor: getColor(gameInfo.status),
                        }}>
                        {status !== undefined ? status : "Не выбрано"}
                    </span>
                </div>

                <div className={styles.source}>
                    <span
                        className={styles.tag}
                        style={{
                            backgroundColor: set.color,
                            borderColor: set.color,
                        }}>
                        {set.source === "wikipedia" ? <WikipediaIcon /> : set.source === "steam" ? <SteamIcon /> : <></>}
                        {" " + set.source}
                    </span>
                </div>
            </div>

            <div className={styles.details}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <header className={styles.title}>{gameInfo.title}</header>
                    <div className={styles.year}>{gameInfo.year || "Не указано"}</div>
                </div>

                <div className={styles.genres}>{gameInfo.genre.replace(/,\s*/g, " / ")}</div>

                <hr className={styles.divider} />

                <div className={styles.rating__year}>
                    {/* Добавляем пустой контейнер для сохранения пространства слева */}
                    <div className={styles.rating__container}>
                        {status !== undefined && (
                            <div className={styles.rating}>
                                <div className={styles.rating__content}>
                                    Приоритет:
                                    <CustomRate
                                        className={styles.rating__rate}
                                        allowHalf={true}
                                        defaultValue={gameInfo.priority / 2}
                                        onChange={changePriority}
                                    />
                                </div>
                                <div onClick={updatePriority}>
                                    <span className={`${willUpdate ? styles.rating__update : styles.rating__update__hidden} ${styles.tag}`}>
                                        Обновить
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <CustomDropdown items={statuses} initialSelectedItem={status} onChange={(id) => onChangeStatus(id)} />
            </div>
            <EditGameInfoModal
                gameInfo={gameInfo}
                updateUsersGames={updateUsersGames}
                isModalOpen={editGameInfoModal}
                closeModal={() => setEditGameInfoModal(false)}
            />
            <GameDetailModal gameInfo={gameInfo} isModalOpen={gameDetails} closeModal={() => setGameDetails(false)} imgSource={IMG_SRC} />
        </div>
    );
};
