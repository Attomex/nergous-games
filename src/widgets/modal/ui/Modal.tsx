import { createPortal } from "react-dom";
import styles from "./Modal.module.css";

type ModalSize = "small" | "medium" | "large";

interface ModalClassNames {
    title?: string;
    body?: string;
    footer?: string;
}

interface ModalProps {
    title: React.ReactNode;
    open: boolean;
    onClose: () => void;
    size?: ModalSize;
    classNames?: ModalClassNames;
    footer?: React.ReactNode;
    onOk?: () => void;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
    size = "medium",
    classNames = {
        title: "",
        body: "",
        footer: "",
    },
    title,
    footer,
    open,
    onOk,
    onClose,
    children,
}) => {
    let classTitle = `${styles["modal__title"]} ${styles["break-word"]} ${classNames.title}`;
    let classBody = `${styles["modal__body"]} ${styles["break-word"]} ${classNames.body}`;
    let classFooter = `${styles["modal__footer"]} ${classNames.footer}`;

    const handleCancel = () => {
        onClose?.();
    };

    const handleOk = () => {
        onClose?.();
        onOk?.();
    };

    return (
        createPortal(
            <div
                className={`${styles["modal"]} ${open ? styles["open"] : styles["close"]}`}
                id="modal"
                tabIndex={-1}
                onClick={handleCancel}
            >
                <div className={styles["modal__container"] + " " + styles[size]} onClick={(e) => e.stopPropagation()}>
                    <div className={classTitle}>
                        <h2>{title}</h2>
                    </div>
                    <div className={classBody}>{children}</div>
                    {footer || footer === null ? (
                        <footer className={classFooter}>{footer}</footer>
                    ) : (
                        <footer className={classFooter}>
                            <button className={styles["modal-btn"] + " " + styles["modal-btn__close"]} onClick={handleCancel}>
                                Закрыть
                            </button>
                            <button className={styles["modal-btn"] + " " + styles["modal-btn__ok"]} onClick={handleOk}>
                                Ок
                            </button>
                        </footer>
                    )}
                </div>
            </div>,
            document.body
        )
    );
};
