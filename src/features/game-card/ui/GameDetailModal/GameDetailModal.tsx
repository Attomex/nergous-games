import { GameInfo } from "shared/types";
import { DividerStyled } from "shared/ui";
import styles from "./GameDetailModal.module.css";
import { Modal, ConfigProvider, Rate, Divider, Image } from "antd";
import { LinkIcon } from "widgets/icons";
import { useTranslation } from "react-i18next";

interface GameDetailModalProps {
    gameInfo: GameInfo;
    isModalOpen: boolean;
    closeModal: () => void;
    imgSource: string | undefined;
}

export const GameDetailModal: React.FC<GameDetailModalProps> = ({ gameInfo, isModalOpen, closeModal, imgSource }) => {
    const { t } = useTranslation("translation", { keyPrefix: "gameCard.gameDetails" });

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
                            }}>
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
                {t("more")}
                <LinkIcon />
            </a>

            <p className={styles.devPub}>
                <strong>{t("developer")}:</strong> {gameInfo.developer}
            </p>
            <p className={styles.devPub}>
                <strong>{t("publisher")}:</strong> {gameInfo.publisher}
            </p>
        </Modal>
    );
};
