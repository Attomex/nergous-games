import React, { useState } from "react";
import { Modal, Form, Input, InputNumber, DatePicker, Select, Upload, Button } from "antd";
import { UploadOutlined, PictureOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { api } from "shared/api";
import { showErrorNotification, showSuccessNotification } from "shared/lib";

// Интерфейс для ответа сервера
interface ApiResponse {
    success: boolean;
    message?: string;
    data?: any;
    error?: string;
}

interface CreateGameModalProps {
    isModalOpen: boolean;
    closeModal: () => void;
    onGameCreated: () => void;
}

export const CreateGameModal: React.FC<CreateGameModalProps> = ({ isModalOpen, closeModal, onGameCreated }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const statusOptions = [
        { value: "planned", label: "В планах" },
        { value: "playing", label: "В процессе" },
        { value: "finished", label: "Завершен" },
        { value: "dropped", label: "Брошено" },
    ];

    const onFinish = async (values: any) => {
        try {
            setIsLoading(true);

            // Формируем FormData для отправки файла
            const formData = new FormData();

            // Добавляем все поля из формы
            Object.keys(values).forEach((key) => {
                if (key === "year") {
                    // Преобразуем год в число
                    formData.append(key, values[key].year());
                } else if (key !== "image") {
                    formData.append(key, values[key]);
                }
            });

            // Добавляем файл изображения, если он есть
            if (fileList.length > 0 && fileList[0].originFileObj) {
                formData.append("image", fileList[0].originFileObj);
            }

            // Отправка данных на сервер
            await api()
                .post<ApiResponse>("/games", formData)
                .then((response) => {
                    showSuccessNotification("Игра успешно создана!");
                    closeModalForm();
                    onGameCreated();
                }).catch((error) => {
                    showErrorNotification(error.response.data.error || "Произошла ошибка при создании игры");
                });

        } catch (error) {
            showErrorNotification(`Ошибка при создании игры: ${error}`);
        } finally {
            setIsLoading(false);
        }
    };

    const closeModalForm = () => {
        form.resetFields();
        setFileList([]);
        closeModal();
    };

    const beforeUpload: UploadProps["beforeUpload"] = (file) => {
        const isImage = file.type.startsWith("image/");
        if (!isImage) {
            showErrorNotification("Вы можете загрузить только изображения!");
            return false;
        }

        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            showErrorNotification("Изображение должно быть меньше 5MB!");
            return false;
        }

        return false;
    };

    const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
        setFileList(newFileList.slice(-1)); // Оставляем только последний файл
    };

    return (
        <Modal
            title="Создание игры"
            open={isModalOpen}
            onCancel={closeModalForm}
            footer={[
                <Button key="back" onClick={closeModalForm}>
                    Отмена
                </Button>,
                <Button key="submit" type="primary" icon={<UploadOutlined />} loading={isLoading} onClick={() => form.submit()}>
                    Создать
                </Button>,
            ]}
        >
            <Form form={form} onFinish={onFinish} layout="vertical" autoComplete="off" style={{ maxHeight: "60vh", overflowY: "auto" }}>
                <Form.Item
                    label="Название игры"
                    name="title"
                    style={{ width: "50%" }}
                    rules={[
                        {
                            required: true,
                            message: "Пожалуйста, введите название игры",
                        },
                    ]}
                >
                    <Input placeholder="Название игры" />
                </Form.Item>
                <Form.Item
                    label="Описание игры"
                    name="preambula"
                    rules={[
                        {
                            required: true,
                            message: "Пожалуйста, введите описание игры",
                        },
                    ]}
                >
                    <Input placeholder="Описание игры" />
                </Form.Item>
                <Form.Item
                    label="Год игры"
                    name="year"
                    rules={[
                        {
                            required: true,
                            message: "Пожалуйста, выберите год игры",
                        },
                    ]}
                >
                    <DatePicker
                        picker="year"
                        placeholder="Выберите год игры"
                        disabledDate={(current) => {
                            // Отключаем даты вне диапазона 1900-2100
                            return current && (current.year() < 1900 || current.year() > 2100);
                        }}
                    />
                </Form.Item>
                <Form.Item
                    label="Жанр игры"
                    name="genre"
                    style={{ width: "75%" }}
                    rules={[
                        {
                            required: true,
                            message: "Пожалуйста, введите жанры игры",
                        },
                    ]}
                >
                    <Input placeholder="Жанр игры" />
                </Form.Item>
                <Form.Item
                    label="Ссылка на игру"
                    name="url"
                    style={{ width: "75%" }}
                    rules={[
                        {
                            required: true,
                            message: "Пожалуйста, введите ссылку на игры",
                        },
                    ]}
                >
                    <Input type="url" placeholder="Ссылка на игру" />
                </Form.Item>
                <Form.Item
                    label="Приоритет игры"
                    name="priority"
                    style={{ width: "30%" }}
                    rules={[
                        {
                            required: true,
                            message: "Пожалуйста, введите приоритет игры",
                        },
                    ]}
                >
                    <InputNumber min={0} max={10} style={{ width: "100%" }} placeholder="Приоритет игры" />
                </Form.Item>
                <Form.Item
                    label="Статус игры"
                    name="status"
                    style={{ width: "50%" }}
                    rules={[
                        {
                            required: true,
                            message: "Пожалуйста, выберите статус игры",
                        },
                    ]}
                >
                    <Select placeholder="Выберите статус">
                        {statusOptions.map((option) => (
                            <Select.Option key={option.value} value={option.value}>
                                {option.label}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Разработчик игры"
                    name="developer"
                    style={{ width: "50%" }}
                    rules={[
                        {
                            required: true,
                            message: "Пожалуйста, введите разработчика игры",
                        },
                    ]}
                >
                    <Input placeholder="Разработчик игры" />
                </Form.Item>
                <Form.Item
                    label="Издатель игры"
                    name="publisher"
                    style={{ width: "50%" }}
                    rules={[
                        {
                            required: true,
                            message: "Пожалуйста, введите издателя игры",
                        },
                    ]}
                >
                    <Input placeholder="Издатель игры" />
                </Form.Item>
                <Form.Item
                    label="Обложка игры"
                    name="image"
                    valuePropName="fileList"
                    getValueFromEvent={(e) => e.fileList}
                    rules={[
                        {
                            required: true,
                            message: "Пожалуйста, загрузите обложку игры",
                        },
                    ]}
                >
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        beforeUpload={beforeUpload}
                        onChange={handleChange}
                        accept=".jpg, .jpeg, .png"
                        maxCount={1}
                        onPreview={() => window.open(fileList[0]?.thumbUrl)}
                    >
                        {fileList.length >= 1 ? null : (
                            <div className="ant-upload-drag-icon">
                                <PictureOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
                                <p style={{ marginTop: 8 }}>Загрузить обложку</p>
                            </div>
                        )}
                    </Upload>
                </Form.Item>
            </Form>
        </Modal>
    );
};
