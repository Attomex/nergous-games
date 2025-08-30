import React, { useState } from "react";
import styles from "./GameCard.module.css";
import { Button, ConfigProvider, Divider, Dropdown, Rate, Space, Tag, Badge } from "antd";
import type { MenuProps } from "antd";
import { gameStatuse } from "shared/const";
import { EditFilled } from "@ant-design/icons";
import { GameInfo } from "shared/types";
import { api } from "shared/api";
import { EditGameInfoModal } from "features/edit-game";
import { showErrorNotification, showSuccessNotification } from "shared/lib";
import { statsColors } from "shared/const";
import { useAuth } from "features/auth";
import { ButtonStyled, DropdownStyled, DividerStyled } from "shared/ui";
import { GameDetailModal } from "./GameDetailModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSteam, faWikipediaW } from "@fortawesome/free-brands-svg-icons";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";

const img_source = process.env.REACT_APP_IMG_SRC_URL;

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

    const onChangeStatus: MenuProps["onClick"] = ({ key }) => {
        const keysStatuses = Object.keys(gameStatuse);
        const keyStatus = keysStatuses[Number(key) - 1];
        updateGame("status", keyStatus);
    };

    const statuses: MenuProps["items"] = [
        {
            key: "1",
            label: "В планах",
            extra: <Badge color={statsColors.planned} status="processing" />,
        },
        {
            key: "2",
            label: "В процессе",
            extra: <Badge color={statsColors.playing} status="processing" />,
        },
        {
            key: "3",
            label: "Завершен",
            extra: <Badge color={statsColors.finished} status="processing" />,
        },
        {
            key: "4",
            label: "Брошено",
            extra: <Badge color={statsColors.dropped} status="processing" />,
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
                <img src={img_source + gameInfo.image} alt={gameInfo.title} />
            </div>

            {/* Поверхностные кнопачки */}
            {isAdmin && (
                <div className={styles.editGame}>
                    <EditFilled onClick={() => setEditGameInfoModal(true)} className={styles.editGame__icon} />
                </div>
            )}

            <div className={styles.status__tag}>
                <ConfigProvider
                    theme={{
                        components: {
                            Tag: {
                                defaultBg: getColor(gameInfo.status),
                                colorBorder: getColor(gameInfo.status),
                                defaultColor: "#ffffffff",
                            },
                        },
                    }}>
                    <Tag className={styles.status__tag__text}>{status !== undefined ? status : "Не выбрано"}</Tag>
                </ConfigProvider>
            </div>

            <div className={styles.source}>
                <ConfigProvider
                    theme={{
                        components: {
                            Tag: {
                                defaultBg: set.color,
                                colorBorder: set.color,
                                defaultColor: "#ffffffff",
                            },
                        },
                    }}>
                    <Tag className={styles.source__tag}>
                        <FontAwesomeIcon
                            icon={set.source === "wikipedia" ? faWikipediaW : set.source === "steam" ? faSteam : faCircleQuestion}
                            style={{ marginRight: "5px" }}
                        />
                        {set.source}
                    </Tag>
                </ConfigProvider>
            </div>

            <div className={styles.details}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <header className={styles.title}>{gameInfo.title}</header>
                    <div className={styles.year}>{gameInfo.year || "Не указано"}</div>
                </div>

                <div className={styles.genres}>{gameInfo.genre.replace(/,\s*/g, " / ")}</div>
                <DividerStyled>
                    <Divider className={styles.divider} />
                </DividerStyled>

                <div className={styles.rating__year}>
                    {/* Добавляем пустой контейнер для сохранения пространства слева */}
                    <div className={styles.rating__container}>
                        {status !== undefined && (
                            <Space className={styles.rating}>
                                <div className={styles.rating__content}>
                                    Приоритет:
                                    <ConfigProvider
                                        theme={{
                                            components: {
                                                Rate: {
                                                    starBg: "var(--card-third-text-color)",
                                                },
                                            },
                                        }}>
                                        <Rate
                                            className={styles.rating__rate}
                                            allowHalf
                                            defaultValue={gameInfo.priority / 2}
                                            onChange={changePriority}
                                        />
                                    </ConfigProvider>
                                </div>
                                <Tag
                                    bordered={false}
                                    className={willUpdate ? styles.rating__update : styles.rating__update__hidden}
                                    onClick={updatePriority}>
                                    Обновить
                                </Tag>
                            </Space>
                        )}
                    </div>
                </div>
                <DropdownStyled>
                    <ButtonStyled>
                        <Dropdown menu={{ items: statuses, onClick: onChangeStatus }} trigger={["click"]} className={styles.status}>
                            {/* <div onClick={(e) => e.preventDefault()}>
                                <CaretDownOutlined style={{ marginRight: "4px" }} />
                                Изменить статус
                            </div> */}
                            <Button style={{ fontSize: "var(--card-secondary-font-size)" }}>Изменить статус</Button>
                        </Dropdown>
                    </ButtonStyled>
                </DropdownStyled>
            </div>
            <EditGameInfoModal
                gameInfo={gameInfo}
                updateUsersGames={updateUsersGames}
                isModalOpen={editGameInfoModal}
                closeModal={() => setEditGameInfoModal(false)}
            />
            <GameDetailModal gameInfo={gameInfo} isModalOpen={gameDetails} closeModal={() => setGameDetails(false)} imgSource={img_source} />
        </div>
    );
};
