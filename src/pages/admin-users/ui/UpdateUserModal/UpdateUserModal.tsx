import { SyncIcon, UploadIcon } from "widgets/icons";
import { IUser } from "pages/admin-users/model";
import { ReactNode, useState } from "react";
import api from "shared/api";
import { showErrorNotification, showSuccessNotification } from "shared/lib";
import { IMG_SRC } from "shared/const";
import { Modal } from "widgets/modal";
import styles from "./UpdateUserModal.module.css";
import { CustomDropdown } from "widgets/dropdown";
import { useTranslation } from "react-i18next";

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

    const { t } = useTranslation("translation");

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
            title={t("modals.edit-user.title")}
            open={isModalOpen}
            onClose={closeModal}
            footer={
                <>
                    <button className="button button__cancel" onClick={closeModal} disabled={isLoading}>
                        {t("modals.cancel-btn")}
                    </button>
                    <button className="button button__submit" onClick={onFinish} disabled={isLoading}>
                        {isLoading ? <><SyncIcon spin /> {t("request-response.updating")}</> : <><UploadIcon /> {t("modals.save-btn")}</>}
                    </button>
                </>
            }>
            <div className={styles.form}>
                <div className={styles.formRow}>
                    <label>{t("modals.edit-user.avatar")}</label>
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
                        placeholder="Steam"
                    />
                </div>

                <div className={styles.formRow}>
                    <label>{t("modals.edit-user.role-set.label")}</label>
                    <CustomDropdown
                        items={[
                            { id: 1, label: t("modals.edit-user.role-set.user"), extra: <></> },
                            { id: 2, label: t("modals.edit-user.role-set.admin"), extra: <></> },
                        ]}
                        buttonClassName={styles.button}
                        dropdownClassName={styles.dropdown}
                        initialSelectedItem={role === "user" ? t("modals.edit-user.role-set.user") : t("modals.edit-user.role-set.admin")}
                        onChange={(id) => onChangeRole(id)}
                    />
                </div>
            </div>
        </Modal>
    );
};
