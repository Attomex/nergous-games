import { IUser } from "pages/admin-users/model";
import React from "react";
import { Modal } from "widgets/modal";
import style from "./DeleteUserModal.module.css";
import { SyncIcon, TrashIcon } from "widgets/icons";
import { useTranslation } from "react-i18next";

interface DeleteUserModalProps {
    user: IUser;
    isModalOpen: boolean;
    closeModal: () => void;
    onOk: (id: number) => void;
    loading: boolean;
}

export const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
    user,
    isModalOpen,
    closeModal,
    onOk,
    loading
}) => {
    const { t } = useTranslation("translation");

    return (
        <Modal name="delete-user" title={t("modals.delete-user.title")} open={isModalOpen} onClose={closeModal} footer={
            <>
                <button className="button button__cancel" onClick={closeModal}>{t("modals.cancel-btn")}</button>
                <button className="button button__delete" onClick={() => onOk(user.id)} disabled={loading}>
                    {loading ? <><SyncIcon spin /> {t("request-response.deleting")}</> : <><TrashIcon /> {t("modals.delete-btn")}</>}
                </button>
            </>
        }>
            <p className={style.text}>{t("modals.delete-user.text-target")} <span className={style.userEmail}>{user.email}</span>?</p>
            
            <p className={style.text}>{t("modals.delete-user.text-warning")}</p>
        </Modal>
    );
};