import React, { useState, useEffect, useRef } from "react";
import { GameInfo } from "shared/types";
import { Button, Form, Input, InputNumber, Image } from "antd";
import api from "shared/api";
import { showErrorNotification, showSuccessNotification } from "shared/lib";
import { IMG_SRC } from "shared/const";
import { useTranslation } from "react-i18next";
import { Modal } from "widgets/modal";
import { SyncIcon, UploadIcon } from "widgets/icons";

interface EditGameInfoModalProps {
    gameInfo: GameInfo;
    updateUsersGames: () => void;
    isModalOpen: boolean;
    closeModal: () => void;
}

export const EditGameInfoModal: React.FC<EditGameInfoModalProps> = ({ gameInfo, updateUsersGames, isModalOpen, closeModal }) => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [newImageFile, setNewImageFile] = useState<File | null>(null);
    const { t } = useTranslation("translation");

    const newFileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Разрешенные MIME типы
        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp", // если нужно разрешить webp
        ];

        // Получаем расширение файла
        const fileExtension = file.name.split("gameCard.editGame..").pop()?.toLowerCase();
        const isValidExtension = ["jpg", "jpeg", "png", "webp"].includes(fileExtension || "");

        // Проверяем и по MIME типу и по расширению
        if (!allowedTypes.includes(file.type) || !isValidExtension) {
            showErrorNotification("Разрешены только изображения в формате JPG, JPEG или PNG!");
            e.target.value = ""; // Сбрасываем input
            return;
        }

        // Проверяем размер файла (например, 5MB)
        if (file.size / 1024 / 1024 > 5) {
            showErrorNotification("Изображение должно быть меньше 5MB!");
            e.target.value = ""; // Сбрасываем input
            return;
        }

        setNewImageFile(file);

        // Создаем превью для отображения
        const reader = new FileReader();
        reader.onload = (event) => {
            setPreviewImage(event.target?.result as string);
        };
        reader.readAsDataURL(file);

        if (e.target) e.target.value = "";
    };

    const onFinish = async (values: any) => {
        try {
            setIsLoading(true);

            const { image, ...valuesWithoutImage } = values;

            const mergedData = {
                ...gameInfo,
                ...valuesWithoutImage,
            };

            const formData = new FormData();

            // Добавляем все поля формы
            Object.keys(mergedData).forEach((key) => {
                if (key !== "image") {
                    formData.append(key, mergedData[key]);
                }
            });

            // Если выбрано новое изображение - добавляем его, иначе оставляем старое
            if (newImageFile) {
                formData.append("image", newImageFile);
            } else {
                formData.append("image", gameInfo.image);
            }

            await api.put(`/games/${gameInfo.id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            showSuccessNotification("Данные игры успешно обновлены!");
            updateUsersGames();
        } catch (err) {
            showErrorNotification(`Произошла ошибка при обновлении данных игры ${err}`);
        } finally {
            setIsLoading(false);
            closeModalForm();
        }
    };

    useEffect(() => {
        if (isModalOpen) {
            form.setFieldsValue(gameInfo);
            setPreviewImage(IMG_SRC + gameInfo.image);
            setNewImageFile(null);
        }
    }, [isModalOpen]);

    const closeModalForm = () => {
        setNewImageFile(null);
        setPreviewImage(IMG_SRC + gameInfo.image);
        closeModal();
    };

    return (
        <Modal
            name="edit"
            open={isModalOpen}
            title={`${t("gameCard.editGame.title")}: ${gameInfo.title}`}
            onClose={closeModalForm}
            size="large"
            footer={[
                <button key="back" className="button button__cancel" onClick={closeModal}>
                    {t("gameCard.editGame.form.cancel-btn")}
                </button>,
                <button key="submit" className="button button__submit" disabled={isLoading} onClick={() => form.submit()}>
                    {isLoading ? <><SyncIcon spin />{t("request-response.updating")}</> : <><UploadIcon />{t("gameCard.editGame.form.save-btn")}</>}
                </button>,
            ]}
        >
            <Form key={gameInfo.id} form={form} onFinish={onFinish} labelCol={{ span: 5 }}>
                <Form.Item name="title" label={t("gameCard.editGame.form.name")}>
                    <Input placeholder={t("gameCard.editGame.form.name")} />
                </Form.Item>

                <Form.Item name="year" label={t("gameCard.editGame.form.year")}>
                    <InputNumber placeholder={t("gameCard.editGame.form.year")} />
                </Form.Item>

                <Form.Item name="preambula" label={t("gameCard.editGame.form.desc")}>
                    <Input.TextArea placeholder={t("gameCard.editGame.form.desc")} autoSize={{ minRows: 3, maxRows: 5 }} />
                </Form.Item>

                <Form.Item name="developer" label={t("gameCard.editGame.form.developer")}>
                    <Input placeholder={t("gameCard.editGame.form.developer")} />
                </Form.Item>

                <Form.Item name="publisher" label={t("gameCard.editGame.form.publisher")}>
                    <Input placeholder={t("gameCard.editGame.form.publisher")} />
                </Form.Item>

                <Form.Item name="genre" label={t("gameCard.editGame.form.genre")}>
                    <Input placeholder={t("gameCard.editGame.form.genre")} />
                </Form.Item>

                <Form.Item label={t("gameCard.editGame.form.img")}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        {/* Превью текущего/нового изображения */}
                        {previewImage && <Image src={previewImage} preview={false} width={150} style={{ borderRadius: 4 }} />}

                        {/* Кнопка для загрузки нового изображения */}
                        <div>
                            <input
                                type="file"
                                ref={newFileInputRef}
                                accept=".jpg,.jpeg,.png,.webp"
                                style={{ display: "none" }}
                                onChange={handleImageChange}
                            />
                            <Button icon={<UploadIcon />} onClick={() => newFileInputRef.current?.click()}>
                                {newImageFile ? t("gameCard.editGame.form.change-btn") : t("gameCard.editGame.form.new-img-btn")}
                            </Button>
                            {newImageFile && (
                                <div style={{ marginTop: 8 }}>
                                    <Button
                                        type="link"
                                        danger
                                        onClick={() => {
                                            setNewImageFile(null);
                                            setPreviewImage(IMG_SRC + gameInfo.image);
                                        }}
                                    >
                                        {t("gameCard.editGame.form.cancel-btn")}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};
