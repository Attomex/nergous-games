import React, { useState, useEffect } from "react";
import { GameInfo } from "shared/types";
import { Button, Form, Input, InputNumber, Modal, Image } from "antd";
import { api } from "shared/api";
import { DeleteOutlined, SyncOutlined, UploadOutlined } from "@ant-design/icons";
import { showErrorNotification, showSuccessNotification } from "shared/lib";

interface EditGameInfoModalProps {
    gameInfo: GameInfo;
    updateUsersGames: () => void;
    isModalOpen: boolean;
    closeModal: () => void;
}

export const EditGameInfoModal: React.FC<EditGameInfoModalProps> = ({ gameInfo, updateUsersGames, isModalOpen, closeModal }) => {
    const IMG_LINK = process.env.REACT_APP_IMG_SRC_URL;
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [newImageFile, setNewImageFile] = useState<File | null>(null);

    useEffect(() => {
        // При открытии модалки сбрасываем превью
        setPreviewImage(IMG_LINK + gameInfo.image);
        setNewImageFile(null);
    }, [gameInfo, isModalOpen]);

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
        const fileExtension = file.name.split(".").pop()?.toLowerCase();
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

        e.target.value = "";

        setNewImageFile(file);

        // Создаем превью для отображения
        const reader = new FileReader();
        reader.onload = (event) => {
            setPreviewImage(event.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const onFinish = async (values: any) => {
        try {
            setIsLoading(true);

            const { image, ...valuesWithoutImage } = values;

            const mergedData = {
                ...gameInfo,
                ...valuesWithoutImage,
            }

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

            await api().put(`/games/${gameInfo.id}`, formData, {
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

    const deleteGame = async () => {
        try {
            setIsLoading(true);
            await api().delete(`/games/${gameInfo.id}`);
            showSuccessNotification("Игра успешно удалена!");
            updateUsersGames();
        } catch (err) {
            showErrorNotification(`Произошла ошибка при удалении игры ${err}`);
        } finally {
            setIsLoading(false);
            closeModalForm();
        }
    }

    const closeModalForm = () => {
        setNewImageFile(null);
        setPreviewImage(IMG_LINK + gameInfo.image);
        closeModal();
    };

    return (
        <Modal
            open={isModalOpen}
            title={`Измение информации о игре: ${gameInfo.title}`}
            onCancel={closeModalForm}
            width={600}
            footer={[
                <Button key="back" onClick={closeModal}>
                    Отмена
                </Button>,
                <Button key="delete" onClick={deleteGame} icon={<DeleteOutlined style={{ color: "red" }}/>}>
                    Удалить игру
                </Button>,
                <Button key="submit" type="primary" icon={<SyncOutlined />} loading={isLoading} onClick={() => form.submit()}>
                    Обновить
                </Button>,
            ]}
        >
            <Form form={form} onFinish={onFinish} labelCol={{ span: 5 }}>
                <Form.Item name="title" initialValue={gameInfo.title} label="Название игры">
                    <Input placeholder="Название игры" />
                </Form.Item>

                <Form.Item name="year" initialValue={gameInfo.year} label="Год выпуска">
                    <InputNumber placeholder="Год выпуска" />
                </Form.Item>

                <Form.Item name="preambula" initialValue={gameInfo.preambula} label="Описание">
                    <Input.TextArea placeholder="Описание игры" autoSize={{ minRows: 3, maxRows: 6 }} />
                </Form.Item>

                <Form.Item name="developer" initialValue={gameInfo.developer} label="Разработчик">
                    <Input placeholder="Разработчик" />
                </Form.Item>

                <Form.Item name="publisher" initialValue={gameInfo.publisher} label="Издатель">
                    <Input placeholder="Издатель" />
                </Form.Item>

                <Form.Item name="genre" initialValue={gameInfo.genre} label="Жанр">
                    <Input placeholder="Жанр" />
                </Form.Item>

                <Form.Item label="Изображение">
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        {/* Превью текущего/нового изображения */}
                        <Image src={previewImage} preview={false} width={150} style={{ borderRadius: 4 }} />

                        {/* Кнопка для загрузки нового изображения */}
                        <div>
                            <input type="file" id="image-upload" accept=".jpg,.jpeg,.png" style={{ display: "none" }} onChange={handleImageChange} />
                            <Button icon={<UploadOutlined />} onClick={() => document.getElementById("image-upload")?.click()}>
                                {newImageFile ? "Изменить" : "Загрузить новое"}
                            </Button>
                            {newImageFile && (
                                <div style={{ marginTop: 8 }}>
                                    <Button
                                        type="link"
                                        danger
                                        onClick={() => {
                                            setNewImageFile(null);
                                            setPreviewImage(IMG_LINK + gameInfo.image);
                                        }}
                                    >
                                        Отменить
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
