import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { api } from "shared/api";
import { showErrorNotification, showSuccessNotification } from "shared/lib";
import { ArrowUpOnSquareIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import style from "./CreateGameModal.module.css";

interface CreateGameModalProps {
    isModalOpen: boolean;
    closeModal: () => void;
    onGameCreated: () => void;
}

export const CreateGameModal: React.FC<CreateGameModalProps> = ({ isModalOpen, closeModal, onGameCreated }) => {
    const [formData, setFormData] = useState({
        title: "",
        preambula: "",
        year: "",
        genre: "",
        url: "",
        priority: 0,
        status: "planned",
        developer: "",
        publisher: "",
        image: null as File | null,
    });
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    const statusOptions = [
        { value: "planned", label: "В планах" },
        { value: "playing", label: "В процессе" },
        { value: "finished", label: "Завершен" },
        { value: "dropped", label: "Брошено" },
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;

        if (file) {
            const isImage = file.type.startsWith("image/");
            if (!isImage) {
                showErrorNotification("Вы можете загрузить только изображения!");
                return;
            }

            const isLt5M = file.size / 1024 / 1024 < 5;
            if (!isLt5M) {
                showErrorNotification("Изображение должно быть меньше 5MB!");
                return;
            }

            setFormData((prev) => ({ ...prev, image: file }));
            setPreviewImage(URL.createObjectURL(file));
        } else {
            setFormData((prev) => ({ ...prev, image: null }));
            setPreviewImage(null);
        }
    };

    const handleRemoveImage = () => {
        setFormData((prev) => ({ ...prev, image: null }));
        setPreviewImage(null);
    };

    const onFinish = async (e: React.FormEvent) => {
        e.preventDefault();

        // Ручная валидация
        if (
            !formData.title ||
            !formData.preambula ||
            !formData.year ||
            !formData.genre ||
            !formData.url ||
            formData.priority === null ||
            !formData.status ||
            !formData.developer ||
            !formData.publisher
        ) {
            showErrorNotification("Пожалуйста, заполните все обязательные поля.");
            return;
        }

        if (!formData.image) {
            showErrorNotification("Пожалуйста, загрузите обложку игры.");
            return;
        }

        try {
            setIsLoading(true);

            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                // Пропускаем null-значения
                if (value === null) {
                    return;
                }

                // Если значение - это File (изображение), добавляем его напрямую
                if (key === "image" && value instanceof File) {
                    data.append(key, value);
                } else {
                    // Для всех остальных значений (строки, числа), приводим их к строке
                    data.append(key, String(value));
                }
            });

            await api()
                .post("/games", data)
                .then(() => {
                    showSuccessNotification("Игра успешно создана!");
                    closeModalForm();
                    onGameCreated();
                })
                .catch((error) => {
                    showErrorNotification(error.response.data.error || "Произошла ошибка при создании игры");
                });
        } catch (error) {
            showErrorNotification(`Ошибка при создании игры: ${error}`);
        } finally {
            setIsLoading(false);
        }
    };

    const closeModalForm = () => {
        setFormData({
            title: "",
            preambula: "",
            year: "",
            genre: "",
            url: "",
            priority: 0,
            status: "planned",
            developer: "",
            publisher: "",
            image: null,
        });
        setPreviewImage(null);
        closeModal();
    };

    if (!isModalOpen) return null;

    return createPortal(
        <div className={style.modalOverlay}>
            <div className={style.modal}>
                <div className={style.modalHeader}>
                    <h2 className={style.modalTitle}>Создание игры</h2>
                </div>
                <form ref={formRef} onSubmit={onFinish} className={style.form}>
                    <div className={style.formBody}>
                        {/* Поле Название */}
                        <div className={style.formItem}>
                            <label htmlFor="title" className={style.formLabel}>
                                Название игры
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className={style.formInput}
                                placeholder="Название игры"
                                required
                            />
                        </div>

                        {/* Поле Описание */}
                        <div className={style.formItem}>
                            <label htmlFor="preambula" className={style.formLabel}>
                                Описание игры
                            </label>
                            <textarea
                                id="preambula"
                                name="preambula"
                                value={formData.preambula}
                                onChange={handleChange}
                                className={style.formTextarea}
                                placeholder="Описание игры"
                                rows={3}
                                required
                            />
                        </div>

                        {/* Поле Год */}
                        <div className={style.formItem}>
                            <label htmlFor="year" className={style.formLabel}>
                                Год игры
                            </label>
                            <input
                                type="number"
                                id="year"
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                className={style.formInput}
                                placeholder="Год игры"
                                min={1900}
                                max={2100}
                                required
                            />
                        </div>

                        {/* Поле Жанр */}
                        <div className={style.formItem}>
                            <label htmlFor="genre" className={style.formLabel}>
                                Жанр игры
                            </label>
                            <input
                                type="text"
                                id="genre"
                                name="genre"
                                value={formData.genre}
                                onChange={handleChange}
                                className={style.formInput}
                                placeholder="Жанр игры"
                                required
                            />
                        </div>

                        {/* Поле Ссылка */}
                        <div className={style.formItem}>
                            <label htmlFor="url" className={style.formLabel}>
                                Ссылка на игру
                            </label>
                            <input
                                type="url"
                                id="url"
                                name="url"
                                value={formData.url}
                                onChange={handleChange}
                                className={style.formInput}
                                placeholder="Ссылка на игру"
                                required
                            />
                        </div>

                        {/* Поле Приоритет */}
                        <div className={style.formItem}>
                            <label htmlFor="priority" className={style.formLabel}>
                                Приоритет игры (0-10)
                            </label>
                            <input
                                type="number"
                                id="priority"
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className={style.formInput}
                                placeholder="Приоритет игры"
                                min={0}
                                max={10}
                                required
                            />
                        </div>

                        {/* Поле Статус */}
                        <div className={style.formItem}>
                            <label htmlFor="status" className={style.formLabel}>
                                Статус игры
                            </label>
                            <select id="status" name="status" value={formData.status} onChange={handleChange} className={style.formSelect} required>
                                {statusOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Поле Разработчик */}
                        <div className={style.formItem}>
                            <label htmlFor="developer" className={style.formLabel}>
                                Разработчик игры
                            </label>
                            <input
                                type="text"
                                id="developer"
                                name="developer"
                                value={formData.developer}
                                onChange={handleChange}
                                className={style.formInput}
                                placeholder="Разработчик игры"
                                required
                            />
                        </div>

                        {/* Поле Издатель */}
                        <div className={style.formItem}>
                            <label htmlFor="publisher" className={style.formLabel}>
                                Издатель игры
                            </label>
                            <input
                                type="text"
                                id="publisher"
                                name="publisher"
                                value={formData.publisher}
                                onChange={handleChange}
                                className={style.formInput}
                                placeholder="Издатель игры"
                                required
                            />
                        </div>

                        {/* Поле Обложка */}
                        <div className={style.formItem}>
                            <label className={style.formLabel}>Обложка игры</label>
                            <div className={style.uploadContainer}>
                                {previewImage ? (
                                    <div className={style.imagePreview}>
                                        <img src={previewImage} alt="Превью обложки" className={style.previewImg} />
                                        <button type="button" className={style.removeImageBtn} onClick={handleRemoveImage}>
                                            <XMarkIcon className={style.removeIcon} />
                                        </button>
                                    </div>
                                ) : (
                                    <label htmlFor="image-upload" className={style.uploadLabel}>
                                        <PhotoIcon className={style.uploadIcon} />
                                        <p>Загрузить обложку</p>
                                    </label>
                                )}
                                <input
                                    type="file"
                                    id="image-upload"
                                    name="image"
                                    accept="image/jpeg,image/png"
                                    onChange={handleFileChange}
                                    className={style.uploadInput}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </form>
                <div className={style.modalFooter}>
                    <button type="button" className={style.button} onClick={closeModalForm}>
                        Отмена
                    </button>
                    <button type="button" className={`${style.button} ${style.buttonPrimary}`} onClick={onFinish} disabled={isLoading}>
                        {isLoading ? (
                            "Создание..."
                        ) : (
                            <>
                                <ArrowUpOnSquareIcon className={style.iconLeft} />
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
