import { Modal } from "widgets/modal"
import styles from "./DeleteGameModal.module.css";
import React from "react";
import { useTranslation } from "react-i18next";
import { SyncIcon, TrashIcon } from "widgets/icons";

interface DeleteGameModalProps {
    gameName: string;
    gameId: number;
    modalOpen: boolean;
    onClose: () => void;
    onDelete: (id: number) => void;
    loading: boolean;
}

export const DeleteGameModal: React.FC<DeleteGameModalProps> = ({
    gameName,
    gameId,
    modalOpen,
    onClose,
    onDelete,
    loading
}) => {
    const { t } = useTranslation("translation");
// {t("modals.delete-btn")}
    return (
        <Modal name="delete" title={t("modals.delete-game.title")} open={modalOpen} onClose={onClose} footer={
            <>
                <button className="button" onClick={onClose}>{t("modals.cancel-btn")}</button>
                <button className="button button__delete" onClick={() => onDelete(gameId)} disabled={loading}>
                    {loading ? <><SyncIcon spin /> {t("request-response.deleting")}</> : <><TrashIcon /> {t("modals.delete-btn")}</>}
                </button>
            </>
        }>
            <p className={styles.text}>{t("modals.delete-game.text-target")} <span className={styles.gameName}>{gameName}</span>?</p>
            <p className={styles.text}>{t("modals.delete-game.text-warning")}</p>

        </Modal>
    )
}