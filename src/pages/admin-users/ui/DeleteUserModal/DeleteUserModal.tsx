import { IUser } from "pages/admin-users/model";
import React from "react";
import { Modal } from "widgets/modal";
import style from "./DeleteUserModal.module.css";

interface DeleteUserModalProps {
    user: IUser;
    isModalOpen: boolean;
    closeModal: () => void;
    onOk: (id: number) => void;
}

export const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
    user,
    isModalOpen,
    closeModal,
    onOk,
}) => {
    return (
        <Modal name="delete-user" title="Удаление пользователя" open={isModalOpen} onClose={closeModal} footer={
            <div className={style.footer}>
                <button className={style.button} onClick={closeModal}>Отмена</button>
                <button className={`${style.button} ${style.delete}`} onClick={() => onOk(user.id)}>Удалить</button>
            </div>
        }>
            <p className={style.text}>Вы уверены, что хотите удалить пользователя <span className={style.userEmail}>{user.email}</span>?</p>
            
            <p className={style.text}>Это действие полностью удалит все данные пользоватя без возможности восстановления!</p>
        </Modal>
    );
};