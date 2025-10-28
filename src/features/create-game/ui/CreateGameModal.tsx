import React, { useState, useRef } from "react";
import api from "shared/api";
import { capitalizeFirst, showErrorNotification, showSuccessNotification } from "shared/lib";
import { UploadIcon, ImageCardIcon, XMarkLgIcon, SyncIcon } from "widgets/icons";
import style from "./CreateGameModal.module.css";
import { useTranslation } from "react-i18next";
import { Modal } from "widgets/modal";
import { AxiosError } from "axios";

interface CreateGameModalProps {
    isModalOpen: boolean;
    closeModal: () => void;
    onGameCreated: () => void;
}

const EMPTY_FORM = {
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
};

export const CreateGameModal: React.FC<CreateGameModalProps> = ({ isModalOpen, closeModal, onGameCreated }) => {
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { t } = useTranslation("translation");

    const statusOptions = [
        { value: "planned", label: t("addGame.modal.add-new.form.status.planned") },
        { value: "playing", label: t("addGame.modal.add-new.form.status.playing") },
        { value: "finished", label: t("addGame.modal.add-new.form.status.finished") },
        { value: "dropped", label: t("addGame.modal.add-new.form.status.dropped") },
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
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
            if (errors.image) {
                setErrors((prev) => ({
                    ...prev,
                    image: "",
                }));
            }
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

        const formErrors = validateForm();
        setErrors(formErrors);

        if (Object.keys(formErrors).length > 0) {
            const firstErrorKey = Object.keys(formErrors)[0];
            const firstInputErr = document.getElementById(firstErrorKey) as HTMLInputElement;
            if (firstErrorKey !== "image") {
                firstInputErr.focus();
                firstInputErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                fileInputRef.current?.click();
            }
            showErrorNotification("Пожалуйста, исправьте ошибки в форме.");
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

            await api
                .post("/games", data)
                .then(() => {
                    showSuccessNotification("Игра успешно создана!");
                    closeModalForm();
                    onGameCreated();
                })
                .catch((error: AxiosError | any) => {
                    showErrorNotification(capitalizeFirst(error.response.data) || "Произошла ошибка при создании игры");
                });
        } catch (error: AxiosError | any) {
            showErrorNotification(`Ошибка при создании игры: ${capitalizeFirst(error.response.data)}`);
        } finally {
            setIsLoading(false);
        }
    };

    const closeModalForm = () => {
        closeModal();
        setFormData(EMPTY_FORM);
        setPreviewImage(null);
        setErrors({});

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const validateForm = (): Record<string, string> => {
        const newErrors: Record<string, string> = {};

        // 1. Проверка обязательных текстовых полей
        if (!formData.title) newErrors.title = "Пожалуйста, введите название";
        if (!formData.preambula) newErrors.preambula = "Пожалуйста, введите описание";

        // 2. Проверка года (число + диапазон)
        const yearNum = Number(formData.year);
        if (!formData.year) {
            newErrors.year = "Пожалуйста, введите год";
        } else if (isNaN(yearNum) || yearNum < 1900 || yearNum > 2100) {
            newErrors.year = "Введите корректный год (1900-2100)";
        }

        if (!formData.genre) newErrors.genre = "Пожалуйста, введите жанр";

        const link = formData.url;
        if (!link) {
            newErrors.url = "Пожалуйста, укажите ссылку";
        } else {
            // Сначала проверяем правильность протокола
            if (!link.startsWith("http://") && !link.startsWith("https://")) {
                newErrors.url = "Ссылка должна начинаться с \"http://\" или \"https://\"";
            } else {
                // Затем проверяем общую валидность URL
                try {
                    new URL(link);
                } catch {
                    newErrors.url = "Введите корректную ссылку (например: https://example.com)";
                }
            }
        }


        const priorityNum = Number(formData.priority);
        if (formData.priority === null || formData.priority === undefined || String(formData.priority) === "") {
            newErrors.priority = "Пожалуйста, укажите приоритет";
        } else if (isNaN(priorityNum) || priorityNum < 0 || priorityNum > 10) {
            newErrors.priority = "Приоритет должен быть числом от 0 до 10";
        }

        if (!formData.developer) newErrors.developer = "Пожалуйста, введите разработчика";
        if (!formData.publisher) newErrors.publisher = "Пожалуйста, введите издателя";

        if (!formData.image) {
            newErrors.image = "Пожалуйста, загрузите обложку";
        }

        return newErrors;
    };

    return (
        <Modal name="create" title={t("addGame.modal.add-new.title")} footer={
            <>
                <button type="button" className="button button__cancel" onClick={closeModalForm}>
                    {t("addGame.modal.cancel-btn")}
                </button>
                <button type="submit" className="button button__submit" onClick={onFinish} disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <SyncIcon spin />
                            {t("request-response.creating")}
                        </>
                    ) : (
                        <>
                            <UploadIcon />
                            {t("addGame.modal.create-btn")}
                        </>
                    )}
                </button>
            </>
        } open={isModalOpen} onClose={closeModalForm}>
            <form ref={formRef} onSubmit={onFinish}>
                {/* Поле Название */}
                <div className={style.formItem}>
                    <label htmlFor="title" className={style.formLabel}>
                        {t("addGame.modal.add-new.form.name")}
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className={style.formInput}
                        placeholder={t("addGame.modal.add-new.form.name")}
                        required
                    />
                    {errors.title && <span className={style["error-msg"]}>{errors.title}</span>}
                </div>

                {/* Поле Описание */}
                <div className={style.formItem}>
                    <label htmlFor="preambula" className={style.formLabel}>
                        {t("addGame.modal.add-new.form.desc")}
                    </label>
                    <textarea
                        id="preambula"
                        name="preambula"
                        value={formData.preambula}
                        onChange={handleChange}
                        className={style.formTextarea}
                        placeholder={t("addGame.modal.add-new.form.desc")}
                        rows={3}
                        required
                    />
                    {errors.preambula && <span className={style["error-msg"]}>{errors.preambula}</span>}
                </div>

                {/* Поле Год */}
                <div className={style.formItem}>
                    <label htmlFor="year" className={style.formLabel}>
                        {t("addGame.modal.add-new.form.year")}
                    </label>
                    <input
                        type="number"
                        id="year"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        className={style.formInput}
                        placeholder={t("addGame.modal.add-new.form.year")}
                        min={1900}
                        max={2100}
                        required
                    />
                    {errors.year && <span className={style["error-msg"]}>{errors.year}</span>}
                </div>

                {/* Поле Жанр */}
                <div className={style.formItem}>
                    <label htmlFor="genre" className={style.formLabel}>
                        {t("addGame.modal.add-new.form.genre")}
                    </label>
                    <input
                        type="text"
                        id="genre"
                        name="genre"
                        value={formData.genre}
                        onChange={handleChange}
                        className={style.formInput}
                        placeholder={t("addGame.modal.add-new.form.genre")}
                        required
                    />
                    {errors.genre && <span className={style["error-msg"]}>{errors.genre}</span>}
                </div>

                {/* Поле Ссылка */}
                <div className={style.formItem}>
                    <label htmlFor="url" className={style.formLabel}>
                        {t("addGame.modal.add-new.form.source")}
                    </label>
                    <input
                        type="url"
                        id="url"
                        name="url"
                        value={formData.url}
                        onChange={handleChange}
                        className={style.formInput}
                        placeholder={t("addGame.modal.add-new.form.source")}
                        required
                    />
                    {errors.url && <span className={style["error-msg"]}>{errors.url}</span>}
                </div>

                {/* Поле Приоритет */}
                <div className={style.formItem}>
                    <label htmlFor="priority" className={style.formLabel}>
                        {t("addGame.modal.add-new.form.priority")}
                    </label>
                    <input
                        type="number"
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className={style.formInput}
                        placeholder={t("addGame.modal.add-new.form.priority")}
                        min={0}
                        max={10}
                        required
                    />
                    {errors.priority && <span className={style["error-msg"]}>{errors.priority}</span>}
                </div>

                {/* Поле Статус */}
                <div className={style.formItem}>
                    <label htmlFor="status" className={style.formLabel}>
                        {t("addGame.modal.add-new.form.status.label")}
                    </label>
                    <select id="status" name="status" value={formData.status} onChange={handleChange} className={style.formSelect} required>
                        {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    {errors.status && <span className={style["error-msg"]}>{errors.status}</span>}
                </div>

                {/* Поле Разработчик */}
                <div className={style.formItem}>
                    <label htmlFor="developer" className={style.formLabel}>
                        {t("addGame.modal.add-new.form.developer")}
                    </label>
                    <input
                        type="text"
                        id="developer"
                        name="developer"
                        value={formData.developer}
                        onChange={handleChange}
                        className={style.formInput}
                        placeholder={t("addGame.modal.add-new.form.developer")}
                        required
                    />
                    {errors.developer && <span className={style["error-msg"]}>{errors.developer}</span>}
                </div>

                {/* Поле Издатель */}
                <div className={style.formItem}>
                    <label htmlFor="publisher" className={style.formLabel}>
                        {t("addGame.modal.add-new.form.publisher")}
                    </label>
                    <input
                        type="text"
                        id="publisher"
                        name="publisher"
                        value={formData.publisher}
                        onChange={handleChange}
                        className={style.formInput}
                        placeholder={t("addGame.modal.add-new.form.publisher")}
                        required
                    />
                    {errors.publisher && <span className={style["error-msg"]}>{errors.publisher}</span>}
                </div>

                {/* Поле Обложка */}
                <div className={style.formItem}>
                    <label className={style.formLabel}>{t("addGame.modal.add-new.form.img")}</label>
                    <div className={style.uploadContainer}>
                        {previewImage ? (
                            <div className={style.imagePreview}>
                                <img src={previewImage} alt="" className={style.previewImg} />
                                <button type="button" className={style.removeImageBtn} onClick={handleRemoveImage}>
                                    <XMarkLgIcon className={style.removeIcon} />
                                </button>
                            </div>
                        ) : (
                            <label htmlFor="image-upload" className={style.uploadLabel}>
                                <ImageCardIcon className={style.uploadIcon} />
                                <p>{t("addGame.modal.add-new.form.new-img-btn")}</p>
                            </label>
                        )}
                        <input
                            type="file"
                            id="image-upload"
                            name="image"
                            ref={fileInputRef}
                            accept="image/jpeg,image/png"
                            onChange={handleFileChange}
                            className={style.uploadInput}
                            required
                        />
                    </div>
                    {errors.image && <span className={style["error-msg"]}>{errors.image}</span>}
                </div>

            </form>
        </Modal>
    );
};
