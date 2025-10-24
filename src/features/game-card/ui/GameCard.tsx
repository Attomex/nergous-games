import React from "react";
import styles from "./GameCard.module.css";
import { DropdownItem, DropdownProps, GameInfo } from "shared/types";
import { statsColors } from "shared/const";
import { useAuth } from "features/auth";
import { WikipediaIcon, SteamIcon, IGDBIcon, StarFillIcon, ThreeDotIcon, EditIcon, TrashIcon } from "widgets/icons";
import { IMG_SRC } from "shared/const";
import { EyeIcon } from "widgets/icons";
import { useTranslation } from "react-i18next";
import { getYearFromDate } from "shared/lib";
import { Dropdown } from "widgets/dropdown";

interface GameCardProps {
    gameInfo: GameInfo;
    openDetails: (gameInfo: GameInfo) => void;
    openEdit: (gameInfo: GameInfo) => void;
    openDelete: (id: number, title: string) => void;
}

export const GameCard: React.FC<GameCardProps> = ({ gameInfo, openDetails, openEdit, openDelete }) => {
    const { isAdmin } = useAuth();
    const { t } = useTranslation("translation");
    const textStatus = `gameCard.status.${gameInfo.status ? gameInfo.status : "no-select"}`;
    const status = t(textStatus as any);

    // Изменение приоритета
    const getColor = (status: string): string => {
        switch (status) {
            case "planned":
                return statsColors.planned;
            case "playing":
                return statsColors.playing;
            case "finished":
                return statsColors.finished;
            case "dropped":
                return statsColors.dropped;
            default:
                return "gray";
        }
    };

    const getColorSource = (url: string): { color: string; source: string } => {
        const set = {
            color: "",
            source: "",
        };
        if (url.includes("wikipedia")) {
            // set.color = "#f3956a";
            set.color = "#3366ccff";
            set.source = "Wikipedia";
        } else if (url.includes("steampowered")) {
            // set.color = "#bfbfbf";
            set.color = "#171a21";
            set.source = "Steam";
        } else if (url.includes("www.igdb.com")) {
            // set.color = "#f3956a";
            set.color = "#8d4affff";
            set.source = "IGDB";
        } else {
            set.color = "#0facb8ff";
            // set.color = "#8e44ad";
            set.source = "other";
        }

        return set;
    };

    const set = getColorSource(gameInfo.url);

    const kebabItemAction: DropdownProps["onClick"] = ({ key }) => {
        if (key === 1) openEdit(gameInfo);
        else if (key === 2) openDelete(gameInfo.id, gameInfo.title);
    };

    const kebabItems: DropdownItem[] = [
        {
            id: 1,
            label: "Редактировать",
            icon: <EditIcon />,
        },
        {
            id: 2,
            label: "Удалить",
            icon: <TrashIcon />,
            danger: true,
        },
    ]

    return (
        <article className={styles.card}>
            {/* Левый столбец — изображение */}
            <div className={styles.image} onClick={() => openDetails(gameInfo)}>
                <img loading="lazy" src={IMG_SRC + gameInfo.image} alt={gameInfo.title} />

                {/* Поверхностные кнопачки */}
                {/* {isAdmin && (
                    <div
                        className={styles.editGame}
                        onClick={(e) => {
                            e.stopPropagation();
                            setEditGameInfoModal(true);
                        }}
                    >
                        <EditIcon />
                    </div>
                )} */}

                <div className={styles.eye}>
                    <EyeIcon w="48px" h="48px" />
                </div>

                <div className={styles.status__tag}>
                    <span
                        className={styles.tag}
                        style={{
                            backgroundColor: getColor(gameInfo.status),
                            borderColor: getColor(gameInfo.status),
                        }}
                    >
                        {status !== undefined ? status : t("gameCard.status.no-select")}
                    </span>
                </div>

                <div className={styles.source}>
                    <a
                        className={styles.tag}
                        style={{
                            backgroundColor: set.color,
                            borderColor: set.color,
                        }}
                        href={gameInfo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Ссылка на сайт"
                        onClick={(e) => e.stopPropagation()}
                        tabIndex={-1}
                    >
                        {set.source === "Wikipedia" ? <WikipediaIcon /> : set.source === "Steam" ? <SteamIcon /> : set.source === "IGDB" ? <IGDBIcon /> : <></>}
                        {" " + set.source}
                    </a>
                </div>
            </div>

            <div className={styles.details}>
                <div className={styles.header__wrapper}>
                    <header className={styles.title}>{gameInfo.title}</header>
                    {isAdmin &&<div className={styles.cardActions} onClick={(e) => e.stopPropagation()}>
                        <Dropdown options={kebabItems} buttonIcon={<ThreeDotIcon />} onClick={kebabItemAction}/>
                    </div>}
                    <div className={styles.year}>{getYearFromDate(gameInfo.year) || t("gameCard.year.no-year")}</div>
                </div>

                <div className={styles.genres}>
                    <p className={styles.genre__text}>
                        {gameInfo.genre.replace(/,\s*/g, " / ")}
                    </p>
                    <span className={styles.priority}>
                        <StarFillIcon />{gameInfo.priority}
                    </span>
                </div>

                <div className={styles.description}>{gameInfo.preambula}</div>

                {/* <hr className={styles.divider} />

                <div className={styles.rating__year}>
                    <div className={styles.rating__container}>
                        {status !== undefined && (
                            <div className={styles.rating}>
                                <div className={styles.rating__content}>
                                    <span className={styles.priority__text}>{t("gameCard.priority.text")}</span>
                                    <CustomRate
                                        className={styles.rating__rate}
                                        allowHalf={true}
                                        defaultValue={gameInfo.priority / 2}
                                        onChange={changePriority}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <CustomDropdown buttonClassName={styles["status-change"]} dropdownClassName={styles["status-change__dropdown"]} items={statuses} initialSelectedItem={status} onChange={(id) => onChangeStatus(id)} /> */}
            </div>
            
        </article>
    );
};
