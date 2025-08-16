import { GameInfo } from "../../../pages/GamePage/GamePage";
import styles from "./GameDetailModal.module.css";
import { Modal, ConfigProvider, Rate, Button } from "antd";

interface GameDetailModalProps {
    gameInfo: GameInfo;
    isModalOpen: boolean;
    closeModal: () => void;
    imgSource: string | undefined;
}

const GameDetailModal: React.FC<GameDetailModalProps> = ({ gameInfo, isModalOpen, closeModal, imgSource }) => {
    return (
        <Modal
            open={isModalOpen}
            footer={
                <div className={styles.footer}>
                    <Button onClick={closeModal}>Cancel</Button>
                    <Button type="primary">Play</Button>
                </div>
            }
            closable
            onCancel={closeModal}
            className={styles.modal}
            centered
        >
            <div className={styles.content}>
                <div className={styles.imageWrapper}>
                    <img src={imgSource + gameInfo.image} alt={gameInfo.title} />
                </div>
                <div className={styles.info}>
                    <h2 className={styles.title}>{gameInfo.title}</h2>
                    <p className={styles.genre}>{gameInfo.genre.replace(/,\s*/g, " / ")}</p>
                    <div className={styles.meta}>
                        <ConfigProvider
                            theme={{
                                components: {
                                    Rate: {
                                        starBg: "var(--bg-color)",
                                    },
                                },
                            }}
                        >
                            <Rate allowHalf defaultValue={gameInfo.priority / 2} disabled />
                        </ConfigProvider>
                        <span className={styles.year}>2025</span>
                    </div>
                </div>
            </div>

            <p className={styles.description}>{gameInfo.preambula}</p>
            <a className={styles.showMore} href={gameInfo.url} target="_blank" rel="noopener noreferrer">
                Show more
            </a>

            <p>
                <strong>Developer:</strong> {gameInfo.developer}
            </p>
            <p>
                <strong>Publisher:</strong> {gameInfo.publisher}
            </p>
        </Modal>
    );
};

export default GameDetailModal;
