import React, { useState } from "react";
import styles from "./GameCard.module.css";
import { Button, ConfigProvider, Divider, Dropdown, Rate, Space, Tag, Badge } from "antd";
import type { MenuProps } from "antd";
import { gameStatuse } from "../../../constants/gameStatuse";
import { CaretDownOutlined, EditFilled } from "@ant-design/icons";
import { GameInfo } from "../../../pages/GamePage/GamePage";
import api from "../../../api/api";
import EditGameInfoModal from "../EditGameInfoModal/EditGameInfoModal";
import { showErrorNotification, showSuccessNotification } from "../../Notification/Notification";
import { statsColors } from "../../../constants/statsColor";
import { useAuth } from "../../../context/AuthContext";
import { ButtonStyled, DropdownStyled } from "../../../styled-components";
import GameDetailModal from "../GameDetailModal/GameDetailModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSteam, faWikipediaW } from "@fortawesome/free-brands-svg-icons";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";

const img_source = process.env.REACT_APP_IMG_SRC_URL;

interface GameCardProps {
    gameInfo: GameInfo;
    updateUsersGames: () => void;
}

const GameCard: React.FC<GameCardProps> = ({ gameInfo, updateUsersGames }) => {
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
            set.color = "#f3956a";
            set.source = "wikipedia";
        } else if (url.includes("steampowered")) {
            set.color = "#bfbfbf";
            set.source = "steam";
        } else {
            set.color = "#49aa19";
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
                    <EditFilled onClick={() => setEditGameInfoModal(true)} />
                </div>
            )}

            <div className={styles.status__tag}>
                <ConfigProvider
                    theme={{
                        components: {
                            Tag: {
                                defaultBg: getColor(gameInfo.status),
                                colorBorder: getColor(gameInfo.status),
                                defaultColor: "#000000ff",
                            },
                        },
                    }}
                >
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
                                defaultColor: "#000000ff",
                            },
                        },
                    }}
                >
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
                <header className={styles.title}>{gameInfo.title}</header>
                <div className={styles.genres}>{gameInfo.genre.replace(/,\s*/g, " / ")}</div>
                <Divider className={styles.divider} />

                <div className={styles.rating__year}>
                    <ConfigProvider
                        theme={{
                            components: {
                                Rate: {
                                    starBg: "var(--bg-color)",
                                },
                                Tag: {
                                    defaultBg: "var(--bg-color)",
                                },
                            },
                        }}
                    >
                        {/* Добавляем пустой контейнер для сохранения пространства слева */}
                        <div className={styles.rating__container}>
                            {status !== undefined && (
                                <Space className={styles.rating}>
                                    <div className={styles.rating__content}>
                                        Приоритет:
                                        <Rate
                                            className={styles.rating__rate}
                                            allowHalf
                                            defaultValue={gameInfo.priority / 2}
                                            onChange={changePriority}
                                        />
                                    </div>
                                    <Tag
                                        bordered={false}
                                        className={willUpdate ? styles.rating__update : styles.rating__update__hidden}
                                        onClick={updatePriority}
                                    >
                                        Обновить
                                    </Tag>
                                </Space>
                            )}
                        </div>
                    </ConfigProvider>

                    <div className={styles.year}>{gameInfo.year || "Не указано"}</div>
                </div>
                <DropdownStyled>
                    <ButtonStyled>
                        <Dropdown menu={{ items: statuses, onClick: onChangeStatus }} trigger={["click"]} className={styles.status}>
                            {/* <div onClick={(e) => e.preventDefault()}>
                                <CaretDownOutlined style={{ marginRight: "4px" }} />
                                Изменить статус
                            </div> */}
                            <Button icon={<CaretDownOutlined />}>Изменить статус</Button>
                        </Dropdown>
                    </ButtonStyled>
                </DropdownStyled>
            </div>
            {editGameInfoModal ? (
                <EditGameInfoModal
                    gameInfo={gameInfo}
                    updateUsersGames={updateUsersGames}
                    isModalOpen={editGameInfoModal}
                    closeModal={() => setEditGameInfoModal(false)}
                />
            ) : null}
            {gameDetails ? (
                <GameDetailModal gameInfo={gameInfo} isModalOpen={gameDetails} closeModal={() => setGameDetails(false)} imgSource={img_source} />
            ) : null}
        </div>
    );
};

export default GameCard;
