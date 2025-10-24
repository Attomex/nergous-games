import React, { useState } from "react";
import api from "shared/api";
import { showErrorNotification, showSuccessNotification } from "shared/lib";
import { TrashIcon, PlusLgIcon, UploadIcon } from "widgets/icons";
import style from "./AddGamesModal.module.css";
import { useTranslation } from "react-i18next";
import { Modal } from "widgets/modal";

interface AddGamesModalProps {
    isModalOpen: boolean;
    closeModal: () => void;
    onAddGames: () => void;
}

export const AddGamesModal: React.FC<AddGamesModalProps> = ({ isModalOpen, closeModal, onAddGames }) => {
    const [games, setGames] = useState([{ name: "" }]);
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation("translation", { keyPrefix: "addGame.modal" });

    const onFinish = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);

            const gameData = games.map((game) => ({
                name: game.name.trim()
            }));

            // Проверка на пустые поля
            if (gameData.some((game) => !game.name)) {
                throw new Error("Пожалуйста, заполните все поля.");
            }

            await api
                .post("/games/twitch", { games: gameData })
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
        setGames([{ name: "" }]);
        closeModal();
    };

    const handleGameChange = (index: number, field: "name", value: string) => {
        const newGames = [...games];
        newGames[index][field] = value;
        setGames(newGames);
    };

    const addGame = () => {
        setGames([...games, { name: "" }]);
    };

    const removeGame = (index: number) => {
        const newGames = games.filter((_, i) => i !== index);
        setGames(newGames);
    };

    return (
        <Modal name="add-games" title={t("add-several.title")} footer={
            <div className={style.modalFooter}>
                <button className={style.button} onClick={closeModalForm}>
                    {t("cancel-btn")}
                </button>
                <button className={`${style.button} ${style.buttonPrimary}`} onClick={onFinish} disabled={isLoading}>
                    {isLoading ? (
                        "Создание..."
                    ) : (
                        <>
                            <UploadIcon className={style.iconLeft} />
                            {t("create-btn")}
                        </>
                    )}
                </button>
            </div>
        } open={isModalOpen} onClose={closeModalForm}>
            <form onSubmit={onFinish} className={style.form}>
                <div className={style.formList}>
                    {games.map((game, index) => (
                        <div key={index} className={style.formItemContainer}>
                            <div className={style.formItem}>
                                <label htmlFor="name" className={style.formLabel}>
                                    {t("add-several.form.name")}
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={game.name}
                                    onChange={(e) => handleGameChange(index, "name", e.target.value)}
                                    placeholder={t("add-several.form.name")}
                                    className={style.formInput}
                                    required
                                />
                            </div>
                            <button type="button" className={style.deleteButton} onClick={() => removeGame(index)}>
                                <TrashIcon className={style.icon} />
                            </button>
                        </div>
                    ))}
                    <button type="button" className={style.addButton} onClick={addGame}>
                        <PlusLgIcon className={style.icon} /> {t("add-several.form.plus-btn")}
                    </button>
                </div>
            </form>

        </Modal>
    );
};
