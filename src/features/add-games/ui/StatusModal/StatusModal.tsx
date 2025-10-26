import { Modal } from "widgets/modal"

interface StatusModalProps {
    isOpen: boolean
    onClose: () => void
}

export const StatusModal: React.FC<StatusModalProps> = ({
    isOpen,
    onClose
}) => {
    return (
        <Modal name="status-games" open={isOpen} closable onClose={onClose}>
            dsds
        </Modal>
    )
}