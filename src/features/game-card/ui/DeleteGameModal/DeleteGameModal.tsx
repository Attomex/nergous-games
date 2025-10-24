import { Modal } from "widgets/modal"
import styles from "./DeleteGameModal.module.css";
import React from "react";

interface DeleteGameModalProps {
    gameName: string;
    gameId: number;
    modalOpen: boolean;
    onClose: () => void;
    onDelete: (id: number) => void;
}

export const DeleteGameModal: React.FC<DeleteGameModalProps> = ({
    gameName,
    gameId,
    modalOpen,
    onClose,
    onDelete
}) => {
    return (
        <Modal name="delete" title="Удаление игры" open={modalOpen} onClose={onClose} footer={
            <div className={styles.footer}>
                <button className={styles.button} onClick={onClose}>Отмена</button>
                <button className={`${styles.button} ${styles.delete}`} onClick={() => onDelete(gameId)}>Удалить</button>
            </div>
        }>
            <p className={styles.text}>Вы уверены, что хотите удалить игру <span className={styles.gameName}>{gameName}</span>?</p>
            <p className={styles.text}>Это действие полностью удалит все данные игры без возможности восстановления!</p>

        </Modal>
    )
}