import { Modal, Form, Input, Button, Radio, Space } from "antd";
import { DeleteOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import api from "../../../api/api";
import { showErrorNotification, showSuccessNotification } from "../../Notification/Notification";

interface AddGamesModalProps {
    isModalOpen: boolean;
    closeModal: () => void;
    onAddGames: () => void;
}

const AddGamesModal: React.FC<AddGamesModalProps> = ({ isModalOpen, closeModal, onAddGames }) => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);

    const onFinish = async (values: any) => {
        try {
            setIsLoading(true);

            const gameData = values.games.map((game: any) => ({
                name: game.name.trim(),
                source: game.source,
            }));

            await api()
                .post("/games/multi", { games: gameData })
                .then((response) => {
                    onAddGames();
                })
                .catch((error) => {
                    throw new Error(error.response.data);
                });

            showSuccessNotification("Все игры успешно добавлены!");
        } catch (error) {
            showErrorNotification(`${error}`);
        } finally {
            closeModalForm();
            setIsLoading(false);
        }
    };

    const closeModalForm = () => {
        form.resetFields();
        closeModal();
    };

    return (
        <Modal
            title="Добавление игр"
            open={isModalOpen}
            onCancel={closeModalForm}
            footer={[
                <Button key="back" onClick={closeModalForm}>
                    Отмена
                </Button>,
                <Button key="submit" type="primary" icon={<UploadOutlined />} loading={isLoading} onClick={() => form.submit()}>
                    Создать
                </Button>,
            ]}>
            <Form
                form={form}
                onFinish={onFinish}
                autoComplete="off"
                layout="vertical"
                initialValues={{ games: [{ name: "", source: "Steam" }] }}
                labelCol={{ span: 7 }}>
                <Form.List name="games">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Space key={key} style={{ display: "flex", marginBottom: 8 }} align="start">
                                    <Form.Item
                                        {...restField}
                                        name={[name, "name"]}
                                        rules={[{ required: true, message: "Пожалуйста, введите название игры" }]}>
                                        <Input placeholder="Название игры" />
                                    </Form.Item>
                                    <Form.Item
                                        {...restField}
                                        name={[name, "source"]}
                                        rules={[{ required: true, message: "Пожалуйста, выберите источник" }]}>
                                        <Radio.Group>
                                            <Radio value="Steam">Steam</Radio>
                                            <Radio value="Wiki">Wiki</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                    <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)}></Button>
                                </Space>
                            ))}
                            <Form.Item>
                                <Button type="dashed" onClick={() => add({ source: "Steam" })} block icon={<PlusOutlined />}>
                                    Добавить игру
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            </Form>
        </Modal>
    );
};

export default AddGamesModal;
