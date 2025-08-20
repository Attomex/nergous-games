import { SyncOutlined } from "@ant-design/icons";
import { Button, ConfigProvider, Form, Image, Input, Modal, Select } from "antd";
import FormItem from "antd/es/form/FormItem";
import { TUser } from "pages/admin-users/model";
import { ReactNode, useState } from "react";
import { api } from "shared/api";
import { showErrorNotification, showSuccessNotification } from "shared/lib";
import { ButtonStyled, SelectStyled } from "shared/ui";

interface UpdateUserModalProps {
    user: TUser;
    roleTag: ReactNode;
    isModalOpen: boolean;
    closeModal: () => void;
    updateUsers: () => void;
}
const img_src = process.env.REACT_APP_IMG_SRC_URL;

export const UpdateUserModal: React.FC<UpdateUserModalProps> = ({ user, roleTag, isModalOpen, closeModal, updateUsers }) => {
    const [form] = Form.useForm();
    const [changeRole, setChangeRole] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const onFinish = async (values: any) => {
        try {
            setIsLoading(true);

            const mergedData = { ...user, ...values };

            await api().put(`/users/${user.id}`, mergedData);
            showSuccessNotification(`Информация о пользователе ${user.email} была успешно обновлена!`);
        } catch (err) {
            showErrorNotification(`Произошла ошибка при обновлении информации о пользователе ${err}`);
        } finally {
            setIsLoading(false);
            handleCloseModal();
            updateUsers();
        }
    };

    const handleCloseModal = () => {
        closeModal();
        setChangeRole(false);
        form.resetFields();
    };

    return (
        <Modal
            title="Изменение информации"
            open={isModalOpen}
            footer={[
                <Button key="submit" type="primary" icon={<SyncOutlined />} loading={isLoading} onClick={() => form.submit()}>
                    Обновить
                </Button>,
            ]}
            onCancel={handleCloseModal}
            centered
        >
            <Form form={form} onFinish={onFinish} labelCol={{ span: 5 }}>
                <FormItem label="Аватар">
                    <Image
                        src={img_src + user.path_to_photo}
                        preview={false}
                        width={64}
                        height={64}
                        style={{ border: "1px solid var(--accent-color)", borderRadius: "50%", objectFit: "cover" }}
                    />
                </FormItem>

                <Form.Item name="email" initialValue={user?.email} label="Email">
                    <Input type="email" placeholder="Email" />
                </Form.Item>

                <Form.Item name="steam_url" initialValue={user?.steam_url} label="Steam">
                    <Input placeholder="Ссылка на Steam" />
                </Form.Item>
                {changeRole && (
                    <Form.Item name="role" initialValue={user?.is_admin} label="Новая роль">
                        <SelectStyled>
                            <Select placeholder="Выберите роль" value={user?.is_admin}>
                                <Select.Option value={true}>Администратор</Select.Option>
                                <Select.Option value={false}>Пользователь</Select.Option>
                            </Select>
                        </SelectStyled>
                    </Form.Item>
                )}
                <Form.Item label="Роль">
                    {roleTag}
                    <ButtonStyled>
                        <ConfigProvider
                            theme={{
                                components: {
                                    Button: {
                                        colorBorder: "rgba(var(--third-color-rgb), 0.5)",
                                    },
                                },
                            }}
                        >
                            <Button onClick={() => setChangeRole(!changeRole)}>Изменить</Button>
                        </ConfigProvider>
                    </ButtonStyled>
                </Form.Item>
            </Form>
        </Modal>
    );
};
