import { GameInfo } from "shared/types";
import { DividerStyled } from "shared/ui";
import styles from "./GameDetailModal.module.css";
import { Modal, Divider, Image } from "antd";
import { LinkIcon } from "widgets/icons";
import { useTranslation } from "react-i18next";
import { gameStatuse, IMG_SRC } from "shared/const";
import { CustomDropdown } from "widgets/dropdown";
import { showErrorNotification, showSuccessNotification } from "shared/lib";
import api from "shared/api";
import { CustomRate } from "widgets/rate";
import { getYearFromDate } from "shared/lib";

interface GameDetailModalProps {
    gameInfo: GameInfo;
    isModalOpen: boolean;
    closeModal: () => void;
    updateUsersGames: () => void;
}

export const GameDetailModal: React.FC<GameDetailModalProps> = ({ gameInfo, isModalOpen, closeModal, updateUsersGames }) => {
    const { t } = useTranslation("translation", { keyPrefix: "gameCard" });

    const textStatus = `status.${gameInfo.status ? gameInfo.status : "no-select"}`;
    const status = t(textStatus as any) as any;

    const changePriority = async (value: number) => {
        await updateGame("priority", value * 2);
    };

    const onChangeStatus = ({ id }: { id: number }) => {
        if (id === 1) {
            deleteFromUserGame();
            closeModal();
            return;
        }
        const keysStatuses = Object.keys(gameStatuse);
        const keyStatus = keysStatuses[id - 2];
        updateGame("status", keyStatus);
        closeModal();
    };


    const statuses = [
        {
            id: 1,
            label: t("status.no-select"),
            extra: <span className={`${styles["status-badge"]} ${styles["no-select"]}`}></span>,
        },
        {
            id: 2,
            label: t("status.planned"),
            extra: <span className={`${styles["status-badge"]} ${styles.planned}`}></span>,
        },
        {
            id: 3,
            label: t("status.playing"),
            extra: <span className={`${styles["status-badge"]} ${styles.processing}`}></span>,
        },
        {
            id: 4,
            label: t("status.finished"),
            extra: <span className={`${styles["status-badge"]} ${styles.finished}`}></span>,
        },
        {
            id: 5,
            label: t("status.dropped"),
            extra: <span className={`${styles["status-badge"]} ${styles.dropped}`}></span>,
        },
    ];

    const updateGame = async (key: string, value: string | number) => {
        try {
            await api
                .put(`/games/${gameInfo.id}/${key}`, {
                    ...gameInfo,
                    [key]: value,
                })
                .then(() => {
                    showSuccessNotification(`Было обновлено! Обновлено ${key} на ${value}`);
                });
        } catch (err) {
            showErrorNotification(err as string);
        }

        updateUsersGames();
    };

    const deleteFromUserGame = async () => {
        try {
            await api.delete(`/games/${gameInfo.id}/delete-user-game`).then(() => {
                showSuccessNotification("Игра успешно удалена!");
                updateUsersGames();
            })
        } catch (err) {
            showErrorNotification(`Произошла ошибка при удалении игры ${err}`);
        }
    }

    return (
        <Modal open={isModalOpen} footer={null} closable onCancel={closeModal} centered>
            <div className={styles.content}>
                <div className={styles.imageWrapper}>
                    <Image src={IMG_SRC + gameInfo.image} alt={gameInfo.title} />
                </div>
                <div className={styles.info}>
                    <h2 className={styles.title}>{gameInfo.title}</h2>
                    <p className={styles.genre}>{gameInfo.genre.replace(/,\s*/g, " / ")}</p>
                    <div className={styles.meta}>
                        <CustomRate
                            key={gameInfo.id}
                            className={styles.rating__rate}
                            allowHalf={true}
                            defaultValue={gameInfo.priority / 2}
                            onChange={changePriority}
                        />
                        <span className={styles.year}>{getYearFromDate(gameInfo.year) || t("year.no-year")}</span>
                    </div>
                    <CustomDropdown buttonClassName={styles["status-change"]} dropdownClassName={styles["status-change__dropdown"]} items={statuses} initialSelectedItem={status} onChange={(id) => onChangeStatus(id)} />
                </div>

            </div>

            <DividerStyled>
                <Divider style={{ marginTop: "5px", marginBottom: "5px" }}/>
            </DividerStyled>

            <p className={styles.description}>{gameInfo.preambula}</p>
            <a className={styles.showMore} href={gameInfo.url} target="_blank" rel="noopener noreferrer">
                {t("gameDetails.more")}
                <LinkIcon />
            </a>

            <p className={styles.devPub}>
                <strong>{t("gameDetails.developer")}:</strong> {gameInfo.developer}
            </p>
            <p className={styles.devPub}>
                <strong>{t("gameDetails.publisher")}:</strong> {gameInfo.publisher}
            </p>
        </Modal>
    );
};
