import { createPortal } from "react-dom";
import styles from "./Modal.module.css";
import { XMarkLgIcon } from "widgets/icons";

type ModalSize = "small" | "medium" | "large";

interface ModalClassNames {
    title?: string;
    body?: string;
    footer?: string;
}

interface ModalProps {
    name: string;
    title?: React.ReactNode;
    open: boolean;
    closable?: boolean;
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
    name,
    title,
    footer,
    open,
    closable = false,
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

    const Footer = () => {
        if (footer === null) {
            return <></>
        }
        if (footer) {
            return <footer className={classFooter}>{footer}</footer>
        }
        return (
            <footer className={classFooter}>
                {/* <button className={styles["modal-btn"] + " " + styles["modal-btn__close"]} onClick={handleCancel}> */}
                <button className="button button__cancel" onClick={handleCancel}>
                    Закрыть
                </button>
                {/* <button className={styles["modal-btn"] + " " + styles["modal-btn__ok"]} onClick={handleOk}> */}
                <button className="button button__submit" onClick={handleOk}>
                    Ок
                </button>
            </footer>
        )
    }

    return createPortal(
        <div className={`${styles["modal"]} ${open ? styles["open"] : styles["close"]}`} id={`modal_${name}`} tabIndex={-1} onClick={handleCancel}>
            <div className={styles["modal__wrapper"]}>
                <div className={styles["modal__container"] + " " + styles[size] + " " + (closable ? styles["closable"] : "")} onClick={(e) => e.stopPropagation()}>
                    {closable && <span className={styles["modal__close"]} onClick={handleCancel}><XMarkLgIcon /></span>}
                    {title && (
                        <div className={classTitle}>
                            <h2>{title}</h2>
                        </div>
                    )}
                    <div className={classBody}>{children}</div>
                    <Footer />
                </div>
            </div>
        </div>,
        document.body
    );
};
