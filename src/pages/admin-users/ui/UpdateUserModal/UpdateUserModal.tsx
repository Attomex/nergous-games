import { SyncOutlined } from "@ant-design/icons";
import { IUser } from "pages/admin-users/model";
import { ReactNode, useState } from "react";
import api from "shared/api";
import { showErrorNotification, showSuccessNotification } from "shared/lib";
import { IMG_SRC } from "shared/const";
import { Modal } from "widgets/modal";
import styles from "./UpdateUserModal.module.css";
import { CustomDropdown } from "widgets/dropdown";

interface UpdateUserModalProps {
    user: IUser;
    roleTag: ReactNode;
    isModalOpen: boolean;
    closeModal: () => void;
    updateUsers: () => void;
}

export const UpdateUserModal: React.FC<UpdateUserModalProps> = ({ user, isModalOpen, closeModal, updateUsers }) => {
    const [email, setEmail] = useState(user.email);
    const [steamUrl, setSteamUrl] = useState(user.steam_url);
    const [role, setRole] = useState(user.is_admin ? "admin" : "user");

    const [isLoading, setIsLoading] = useState(false);

    const onFinish = async () => {
        try {
            setIsLoading(true);

            const mergedData = { ...user, email, steam_url: steamUrl, is_admin: role === "admin" };

            await api.put(`/users/${user.id}`, mergedData);
            showSuccessNotification(`Информация о пользователе ${user.email} была успешно обновлена!`);
        } catch (err) {
            showErrorNotification(`Произошла ошибка при обновлении информации о пользователе ${err}`);
        } finally {
            setIsLoading(false);
            closeModal();
            updateUsers();
        }
    };

    const onChangeRole = ({ id }: { id: number }) => {
        if (id === 1) {
            setRole("user");
        }
        if (id === 2) {
            setRole("admin");
        }
    };

    return (
        <Modal
            name="update-user"
            title="Изменение информации"
            open={isModalOpen}
            onClose={closeModal}
            footer={
                <div className={styles.footer}>
                    <button className={styles.buttonCancel} onClick={closeModal} disabled={isLoading}>
                        Отменить
                    </button>
                    <button className={styles.buttonSubmit} onClick={onFinish} disabled={isLoading}>
                        {isLoading ? <SyncOutlined spin /> : "Сохранить"}
                    </button>
                </div>
            }>
            <div className={styles.form}>
                <div className={styles.formRow}>
                    <label>Аватар</label>
                    <img src={IMG_SRC + user.path_to_photo} alt="User avatar" width={64} height={64} className={styles.avatar} />
                </div>

                <div className={styles.formRow}>
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={styles.input} placeholder="Email" />
                </div>

                <div className={styles.formRow}>
                    <label>Steam</label>
                    <input
                        type="text"
                        value={steamUrl}
                        onChange={(e) => setSteamUrl(e.target.value)}
                        className={styles.input}
                        placeholder="Ссылка на Steam"
                    />
                </div>

                <div className={styles.formRow}>
                    <label>Роль</label>
                    <CustomDropdown
                        items={[
                            { id: 1, label: "Пользователь", extra: <></> },
                            { id: 2, label: "Администратор", extra: <></> },
                        ]}
                        buttonClassName={styles.button}
                        dropdownClassName={styles.dropdown}
                        initialSelectedItem={role === "user" ? "Пользователь" : "Администратор"}
                        onChange={(id) => onChangeRole(id)}
                    />
                </div>
            </div>
        </Modal>
    );
};
