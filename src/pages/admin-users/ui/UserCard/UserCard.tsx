import { IUser } from "pages/admin-users/model";
import styles from "./UserCard.module.css";
import { ReactNode, useState } from "react";
import { UpdateUserModal } from "../UpdateUserModal";
import { IMG_SRC } from "shared/const";
import { ProfileIcon, ToolsIcon } from "widgets/icons";
import { DeleteUserModal } from "../DeleteUserModal";
import api from "shared/api";
import { showErrorNotification, showSuccessNotification } from "shared/lib";
import { AxiosError } from "axios";
import { capitalizeFirst } from "shared/lib";

interface UserCardProps {
    user: IUser;
    refetch: () => void;
}

const whoIs = (whoIs: boolean | string): { role: string; icon: ReactNode } => {
    if (whoIs) {
        return { role: "Администратор", icon: <ToolsIcon /> };
    } else {
        return { role: "Пользователь", icon: <ProfileIcon /> };
    }
};

const RoleTag = ({ role }: { role: boolean }) => {
    const userIsAdmin = whoIs(role);
    const tagColor = userIsAdmin.role === "Администратор" ? "accentColor" : "tagGray";
    return (
        <div className={`${styles.tag} ${styles[tagColor]}`}>
            <span className={styles["tagIcon"]}>{userIsAdmin.icon}</span>
            {userIsAdmin.role}
        </div>
    );
};



export const UserCard: React.FC<UserCardProps> = ({ user, refetch }) => {
    const [updateModal, setUpdateModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

    const handleDeleteUser = async (id: number) => {
        try {
            await api.delete(`/users/${id}`,);
            showSuccessNotification("Пользователь успешно удален!");
            refetch();
        } catch (err: AxiosError | any) {
            showErrorNotification(`Произошла ошибка при удалении пользователя: ${capitalizeFirst(err.response.data)}`);
        } finally {
            setDeleteModal(false);
        }
    }

    return (
        <div className={styles.card__tile}>
            <img loading="lazy" width={120} height={120} src={IMG_SRC + user.path_to_photo} className={styles.user__avatar} />
            <div className={styles.user__info}>
                <RoleTag role={user.is_admin} />
                <div className={styles.user__email}>{user.email}</div>
                <a className={styles.user__steam} href={user.steam_url} target="_blank" rel="noopener noreferrer">
                    Ссылка на Steam
                </a>
            </div>
            <div className={styles.user__actions}>
                <button className={styles.button} onClick={() => setUpdateModal(true)}>
                    Изменить
                </button>
                <button className={`${styles.button} ${styles.delete}`} onClick={() => setDeleteModal(true)}>Удалить</button>
            </div>

            <UpdateUserModal
                user={user}
                roleTag={<RoleTag role={user.is_admin} />}
                isModalOpen={updateModal}
                closeModal={() => setUpdateModal(false)}
                updateUsers={refetch}
            />

            <DeleteUserModal
                user={user}
                isModalOpen={deleteModal}
                closeModal={() => setDeleteModal(false)}
                onOk={handleDeleteUser}
            />
        </div>
    );
};
