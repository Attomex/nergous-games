import React, { useState } from "react";
import { createPortal } from "react-dom";
import { api } from "shared/api";
import { showErrorNotification, showSuccessNotification } from "shared/lib";
import { TrashIcon, PlusLgIcon, UploadIcon } from "widgets/icons";
import style from "./AddGamesModal.module.css";

interface AddGamesModalProps {
    isModalOpen: boolean;
    closeModal: () => void;
    onAddGames: () => void;
}

export const AddGamesModal: React.FC<AddGamesModalProps> = ({ isModalOpen, closeModal, onAddGames }) => {
    const [games, setGames] = useState([{ name: "", source: "Steam" }]);
    const [isLoading, setIsLoading] = useState(false);

    const onFinish = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);

            const gameData = games.map((game) => ({
                name: game.name.trim(),
                source: game.source,
            }));

            // Проверка на пустые поля
            if (gameData.some((game) => !game.name || !game.source)) {
                throw new Error("Пожалуйста, заполните все поля.");
            }

            await api()
                .post("/games/multi", { games: gameData })
                .then(() => {
                    onAddGames();
                    showSuccessNotification("Все игры успешно добавлены!");
                })
                .catch((error) => {
                    throw new Error(error.response.data);
                });
        } catch (error) {
            showErrorNotification(`${error}`);
        } finally {
            closeModalForm();
            setIsLoading(false);
        }
    };

    const closeModalForm = () => {
        setGames([{ name: "", source: "Steam" }]);
        closeModal();
    };

    const handleGameChange = (index: number, field: "name" | "source", value: string) => {
        const newGames = [...games];
        newGames[index][field] = value;
        setGames(newGames);
    };

    const addGame = () => {
        setGames([...games, { name: "", source: "Steam" }]);
    };

    const removeGame = (index: number) => {
        const newGames = games.filter((_, i) => i !== index);
        setGames(newGames);
    };

    if (!isModalOpen) return null;

    return createPortal(
        <div className={style.modalOverlay}>
            <div className={style.modal}>
                <div className={style.modalHeader}>
                    <h2 className={style.modalTitle}>Добавление игр</h2>
                </div>
                <form onSubmit={onFinish} className={style.form}>
                    <div className={style.formList}>
                        {games.map((game, index) => (
                            <div key={index} className={style.formItemContainer}>
                                <div className={style.formItem}>
                                    <label className={style.formLabel}>Название игры</label>
                                    <input
                                        type="text"
                                        value={game.name}
                                        onChange={(e) => handleGameChange(index, "name", e.target.value)}
                                        placeholder="Название игры"
                                        className={style.formInput}
                                        required
                                    />
                                </div>
                                <div className={style.formItem}>
                                    <label className={style.formLabel}>Источник</label>
                                    <div className={style.radioGroup}>
                                        <label className={style.radioLabel}>
                                            <input
                                                type="radio"
                                                value="Steam"
                                                checked={game.source === "Steam"}
                                                onChange={(e) => handleGameChange(index, "source", e.target.value)}
                                            />
                                            Steam
                                        </label>
                                        <label className={style.radioLabel}>
                                            <input
                                                type="radio"
                                                value="Wiki"
                                                checked={game.source === "Wiki"}
                                                onChange={(e) => handleGameChange(index, "source", e.target.value)}
                                            />
                                            Wiki
                                        </label>
                                    </div>
                                </div>
                                <button type="button" className={style.deleteButton} onClick={() => removeGame(index)}>
                                    <TrashIcon className={style.icon} />
                                </button>
                            </div>
                        ))}
                        <button type="button" className={style.addButton} onClick={addGame}>
                            <PlusLgIcon className={style.icon} /> Добавить игру
                        </button>
                    </div>
                </form>
                <div className={style.modalFooter}>
                    <button className={style.button} onClick={closeModalForm}>
                        Отмена
                    </button>
                    <button className={`${style.button} ${style.buttonPrimary}`} onClick={onFinish} disabled={isLoading}>
                        {isLoading ? (
                            "Создание..."
                        ) : (
                            <>
                                <UploadIcon className={style.iconLeft} />
                                Создать
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};
