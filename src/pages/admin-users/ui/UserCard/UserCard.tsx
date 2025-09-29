import { TUser } from "pages/admin-users/model";
import styles from "./UserCard.module.css";
import { Button, Image, Tag } from "antd";
import { ToolOutlined, UserOutlined } from "@ant-design/icons";
import { ButtonStyled } from "shared/ui";
import { ReactNode, useState } from "react";
import { UpdateUserModal } from "../UpdateUserModal";
import { IMG_SRC } from "shared/const";

interface UserCardProps {
    user: TUser;
    refetch: () => void;
}

const whoIs = (whoIs: boolean | string): { role: string; icon: ReactNode } => {
    if (whoIs) {
        return { role: "Администратор", icon: <ToolOutlined /> };
    } else {
        return { role: "Пользователь", icon: <UserOutlined /> };
    }
};

const RoleTag = ({role}: {role: boolean}) => {
    const userIsAdmin = whoIs(role);
    return (
        <Tag color={userIsAdmin.role === "Администратор" ? "blue" : "gray"} icon={userIsAdmin.icon}>
            {userIsAdmin.role}
        </Tag>
    );
};

export const UserCard: React.FC<UserCardProps> = ({ user, refetch }) => {
    const [updateModal, setUpdateModal] = useState(false);

    return (
        <div className={styles.card__user}>
            <Image
                width={128}
                height={128}
                preview={false}
                src={IMG_SRC + user.path_to_photo}
                className={styles.user__image}
            />
            <div className={styles.user__info}>
                <div className={styles.user__title}>Информация пользователе</div>
                <div className={styles.user__email}>Email: {user.email}</div>
                <div className={styles.user__steam}>Steam URL: {user.steam_url}</div>
                <div className={styles.user__role}>Текущая роль: <RoleTag role={user.is_admin} /></div>
            </div>
            <div className={styles.user__button}>
                <ButtonStyled>
                    <Button onClick={() => setUpdateModal(true)}>Изменить</Button>
                </ButtonStyled>
            </div>
            <UpdateUserModal
                user={user}
                roleTag={<RoleTag role={user.is_admin} />}
                isModalOpen={updateModal}
                closeModal={() => setUpdateModal(false)}
                updateUsers={refetch}
            />
        </div>
    );
};
