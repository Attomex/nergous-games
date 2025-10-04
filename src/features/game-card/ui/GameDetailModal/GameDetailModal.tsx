import { GameInfo } from "shared/types";
import { DividerStyled } from "shared/ui";
import styles from "./GameDetailModal.module.css";
import { Modal, ConfigProvider, Rate, Divider, Image } from "antd";
import { LinkIcon } from "widgets/icons";

interface GameDetailModalProps {
    gameInfo: GameInfo;
    isModalOpen: boolean;
    closeModal: () => void;
    imgSource: string | undefined;
}

export const GameDetailModal: React.FC<GameDetailModalProps> = ({ gameInfo, isModalOpen, closeModal, imgSource }) => {
    return (
        <Modal open={isModalOpen} footer={null} closable onCancel={closeModal} centered>
            <div className={styles.content}>
                <div className={styles.imageWrapper}>
                    <Image src={imgSource + gameInfo.image} alt={gameInfo.title} />
                </div>
                <div className={styles.info}>
                    <h2 className={styles.title}>{gameInfo.title}</h2>
                    <p className={styles.genre}>{gameInfo.genre.replace(/,\s*/g, " / ")}</p>
                    <div className={styles.meta}>
                        <ConfigProvider
                            theme={{
                                components: {
                                    Rate: {
                                        starBg: "var(--card-third-text-color)",
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

            <DividerStyled>
                <Divider />
            </DividerStyled>

            <p className={styles.description}>{gameInfo.preambula}</p>
            <a className={styles.showMore} href={gameInfo.url} target="_blank" rel="noopener noreferrer">
                Узнать больше
                <LinkIcon />
            </a>

            <p className={styles.devPub}>
                <strong>Разработчик:</strong> {gameInfo.developer}
            </p>
            <p className={styles.devPub}>
                <strong>Издатель:</strong> {gameInfo.publisher}
            </p>
        </Modal>
    );
};
