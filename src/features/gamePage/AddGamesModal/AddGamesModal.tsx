import { Modal, Form, Input, Button, Radio } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import api from "../../../api/api";
import { showErrorNotification, showSuccessNotification } from "../../Notification/Notification";

interface AddGamesModalProps {
    isModalOpen: boolean;
    closeModal: () => void;
    onAddGames: () => void;
}

const AddGamesModal: React.FC<AddGamesModalProps> = ({
    isModalOpen,
    closeModal,
    onAddGames
}) => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);

    const onFinish = async (values: any) => {
        try {
            setIsLoading(true);
            
            const gameNamesArray = values.name.split(',').map((name: string) => name.trim());

            const gameData = gameNamesArray.map((name: string) => ({
                name: name,
                source: values.source
            }))

            await api().post('/games/multi', { games: gameData })
                .then((response) => {
                    onAddGames();
                })
                .catch((error) => {
                    throw new Error(error.response.data);
                })
            
            showSuccessNotification('Все игры успешно добавлены!');
        } catch (error) {
            showErrorNotification(`${error}`);
            console.error(error);
        } finally {
            closeModalForm();
            setIsLoading(false);
        }
    }

    const closeModalForm = () => {
        form.resetFields();
        closeModal();
    }

    return (
        <Modal
            title="Добавление игр"
            open={isModalOpen}
            onCancel={closeModalForm}
            footer={
                [<Button key="back" onClick={closeModalForm}>
                    Отмена
                </Button>,
                <Button 
                    key="submit" 
                    type="primary" 
                    icon={<UploadOutlined />}
                    loading={isLoading}
                    onClick={() => form.submit()}
                >
                    Создать
                </Button>,]
            }
        >
            <Form
                form={form}
                onFinish={onFinish}
                autoComplete="off"
                labelCol={{ span: 7 }}
            >
                <Form.Item
                    label="Названия игр"
                    name="name"
                    rules={[{ required: true, message: 'Пожалуйста, введите название игр' }]}
                    style={{ marginBottom: 6 }}
                >
                    <Input placeholder="Названия игр"/>
                </Form.Item>

                <Form.Item
                    label="Информация из"
                    name="source"
                    rules={[{ required: true, message: 'Пожалуйста, выберите источник' }]}
                    initialValue={"Steam"}
                    style={{ marginBottom: 6 }}
                >
                    <Radio.Group>
                        <Radio value="Steam">Steam</Radio>
                        <Radio value="Wiki">Wiki</Radio>
                    </Radio.Group>
                </Form.Item>
            </Form>

        </Modal>
    )
};

export default AddGamesModal;