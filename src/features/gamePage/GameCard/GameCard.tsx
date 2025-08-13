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
                .put(`/games/${gameInfo.id}`, {
                    ...gameInfo,
                    [key]: value,
                })
                .then((response) => {
                    showSuccessNotification(`Было обновлено! Обновлено ${key} на ${value}`);
                });
        } catch (err) {
            showErrorNotification(err as string);
            setNewPriority(gameInfo.priority);
        }

        updateUsersGames();
    };

    return (
        <div className={styles.card}>
            {/* Левый столбец — изображение */}
            <div className={styles.image}>
                <img src={img_source + gameInfo.image} alt={gameInfo.title} />
            </div>

            {isAdmin && (
                <div className={styles.editGame}>
                    <EditFilled onClick={() => setEditGameInfoModal(true)} />
                </div>
            )}

            {/* Правый столбец — вся остальная информация */}
            <div className={styles.details}>
                <header className={styles.header}>
                    <div className={styles.title}>{gameInfo.title}</div>
                    <div className={styles.year}>{gameInfo.year}</div>
                </header>

                <div className={styles.genres}>Жанры: {gameInfo.genre}</div>

                {/* <div className={styles.rating} >Ваша оценка: 8</div> */}
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
                    }}>
                    <Space className={styles.rating}>
                        <div className={styles.rating__container}>
                            Приоритет:
                            <Rate className={styles.rating__rate} allowHalf defaultValue={gameInfo.priority / 2} onChange={changePriority} />
                        </div>
                        <Tag bordered={false} className={willUpdate ? styles.rating__update : styles.rating__update__hidden} onClick={updatePriority}>
                            Обновить
                        </Tag>
                    </Space>
                </ConfigProvider>
                <Divider className={styles.divider} />

                <div className={styles.description}>{gameInfo.preambula}</div>

                <footer className={styles.footer}>
                    <div className={styles.developer}>
                        <strong>Разработчик:</strong>
                        <br />
                        {gameInfo.developer}
                    </div>
                    <div className={styles.publisher}>
                        <strong>Издатель:</strong>
                        <br />
                        {gameInfo.publisher}
                    </div>
                </footer>
                {/* <div className={styles.status}>{gameInfo.status}</div> */}
                <Dropdown menu={{ items: statuses, onClick: onChangeStatus }} trigger={["click"]} className={styles.status}>
                    <div onClick={(e) => e.preventDefault()}>
                        <CaretDownOutlined style={{ marginRight: "4px" }} />
                        {status}
                    </div>
                </Dropdown>
            </div>
            {editGameInfoModal ? (
                <EditGameInfoModal
                    gameInfo={gameInfo}
                    updateUsersGames={updateUsersGames}
                    isModalOpen={editGameInfoModal}
                    closeModal={() => setEditGameInfoModal(false)}
                />
            ) : null}
        </div>
    );
};

export default GameCard;
