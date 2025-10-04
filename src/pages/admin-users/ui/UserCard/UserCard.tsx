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

const RoleTag = ({ role }: { role: boolean }) => {
    const userIsAdmin = whoIs(role);
    return (
        <Tag
            color={userIsAdmin.role === "Администратор" ? "blue" : "default"}
            icon={userIsAdmin.icon}
            style={{ padding: "4px 12px", borderRadius: "12px", fontSize: "0.9rem" }}
        >
            {userIsAdmin.role}
        </Tag>
    );
};

export const UserCard: React.FC<UserCardProps> = ({ user, refetch }) => {
    const [updateModal, setUpdateModal] = useState(false);

    return (
        <div className={styles.card__tile}>
            <Image width={120} height={120} preview={false} src={IMG_SRC + user.path_to_photo} className={styles.user__avatar} />
            <div className={styles.user__info}>
                <RoleTag role={user.is_admin} />
                <div className={styles.user__email}>{user.email}</div>
                <a className={styles.user__steam} href={user.steam_url} target="_blank" rel="noopener noreferrer">
                    {user.steam_url}
                </a>
            </div>
            <div className={styles.user__actions}>
                <ButtonStyled>
                    <Button type="primary" onClick={() => setUpdateModal(true)}>
                        Изменить
                    </Button>
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
