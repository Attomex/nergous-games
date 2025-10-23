import React, { useState, useCallback, useEffect } from "react";
import { Flex } from "shared/ui";
import { Divider } from "shared/ui";
import { Loader } from "shared/ui";

import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";

import styles from "./UserGames.module.css";

import { StatusButtonsGroup } from "./StatusButtonsGroup";

import { GameCard } from "features/game-card";
import { CreateGameModal } from "features/create-game";
import { AddGamesModal } from "features/add-games";
import { useAuth } from "features/auth";

import api from "shared/api";
import { DropdownOption, DropdownProps, GameInfo } from "shared/types";
import { useDebouncedSearch } from "shared/hooks";

import { Paginations } from "widgets/pagination";
import { AddGameButton } from "widgets/add-game-button";
import { SearchInput } from "widgets/search-input";
import { Dropdown } from "widgets/dropdown";
import { AscIcon, CheronLeft, CheronRight, DescIcon, SortAZIcon, SortZAIcon } from "widgets/icons";
import { isDropdownItem } from "shared/types";
import { EmptyItems } from "widgets/empty-items";
import { useTranslation } from "react-i18next";
import { GameDetailModal } from "features/game-detail";

const fetchUserGames = async ({ queryKey }: { queryKey: any }) => {
    const [, params] = queryKey;
    const res = await api.get("/games/user", { params });
    return res.data; // { data: GameInfo[], pages, total }
};

export const UserGames: React.FC = () => {
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState("");
    const { search, debouncedSearch, setSearch } = useDebouncedSearch(setPage, 500);
    const { t } = useTranslation("translation");

    type SortOption = keyof typeof sortOptions;
    const sortOptions = {
        "title-asc": t("sortOptions.title"),
        "title-desc": t("sortOptions.title"),
        "year-desc": t("sortOptions.year"),
        "year-asc": t("sortOptions.year"),
        "priority-desc": t("sortOptions.priority"),
        "priority-asc": t("sortOptions.priority"),
    } as const;

    const [generalSort, setGeneralSort] = useState<SortOption>("title-asc");

    const [modalCreateGame, setModalCreateGame] = useState(false);
    const [modalAddGames, setModalAddGames] = useState(false);

    const [detailsModal, setDetailsModal] = useState(false);
    const [detailsGameInfo, setDetailsGameInfo] = useState<GameInfo>({
        id: 0,
        title: "",
        preambula: "",
        image: "",
        developer: "",
        publisher: "",
        year: "",
        genre: "",
        url: "",
        status: "",
        priority: 0,
    });

    const { checkAdmin } = useAuth();
    const queryClient = useQueryClient();

    const pageSize = 12;
    const { data, isPending, isError } = useQuery({
        queryKey: [
            "userGames",
            { status, page, page_size: pageSize, search: debouncedSearch, sort_by: generalSort.split("-")[0], sort_order: generalSort.split("-")[1] },
        ],
        queryFn: fetchUserGames,
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false,
    });

    const sortItems: DropdownOption[] = [
        {
            id: 1,
            label: t("sortOptions.title"),
            value: "title-asc",
            icon: <SortAZIcon />,
        },
        {
            id: 2,
            label: t("sortOptions.title"),
            value: "title-desc",
            icon: <SortZAIcon />,
        },
        {
            id: 3,
            label: t("sortOptions.year"),
            value: "year-desc",
            icon: <DescIcon />,
        },
        {
            id: 4,
            label: t("sortOptions.year"),
            value: "year-asc",
            icon: <AscIcon />,
        },
        {
            id: 5,
            label: t("sortOptions.priority"),
            value: "priority-desc",
            icon: <DescIcon />,
        },
        {
            id: 6,
            label: t("sortOptions.priority"),
            value: "priority-asc",
            icon: <AscIcon />,
        },
    ];

    const menuItems: DropdownProps["options"] = [
        {
            id: 1,
            label: t("addGame.options.add-new"),
        },
        {
            id: 2,
            label: t("addGame.options.add-several"),
        },
    ];

    const sortHandleChange: DropdownProps["onClick"] = ({ value }) => {
        setGeneralSort(value as SortOption);
    };

    const userGames: GameInfo[] = data?.data ?? [];
    const totalItems: number = data?.total ?? 0;

    const closeModal = () => {
        setModalCreateGame(false);
        setModalAddGames(false);
    };

    const openDetailsModal = (gameInfo: GameInfo) => {
        setDetailsGameInfo(gameInfo);
        setDetailsModal(true);
    };

    const refreshGames = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ["userGames"] });
    }, [queryClient]);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        let newUrl = "";

        if (search) {
            searchParams.set("s", search);
            newUrl = `${window.location.pathname}?${searchParams.toString()}`;
        } else {
            searchParams.delete("s");
            newUrl = `${window.location.pathname}`;
        }

        window.history.replaceState(null, "", newUrl);
    }, [search])

    useEffect(() => {
        checkAdmin();
    }, [checkAdmin]);

    return (
        <>
            <Flex vertical style={{ maxWidth: 1400, margin: "0 auto", gap: 16 }}>
                {/* Верхняя панель */}
                <Flex vertical align="start" gap={16}>
                    <AddGameButton
                        placeholder={t("addGame.label")}
                        menuItems={menuItems}
                        openModalCreateGame={setModalCreateGame}
                        openModalAddGames={setModalAddGames}
                    />

                    <Flex gap={16} style={{ width: "100%" }} className={styles["top-panel"]}>
                        <Flex gap={0} className={styles["status-buttons"]}>
                            <span className={styles["status-buttons__arrow"]}>
                                <CheronLeft />
                            </span>
                            <StatusButtonsGroup status={status} setStatus={setStatus} setPage={setPage} />
                            <span className={styles["status-buttons__arrow"]}>
                                <CheronRight />
                            </span>
                        </Flex>

                        <Flex gap={16} style={{ zIndex: 2 }} className={styles["top-panel__right"]}>
                            <SearchInput value={search} onChange={setSearch} placeholder={t("searchButton.placeholder")} width={300} />
                            <Dropdown
                                options={sortItems}
                                buttonIcon={sortItems.filter(isDropdownItem).find((item) => item.value === generalSort)?.icon}
                                placeholder={sortOptions[generalSort]}
                                onClick={sortHandleChange}
                                className={styles["sort-button"]}
                            />
                            {/* <SortButton value={generalSort} onChange={setGeneralSort} onPageReset={setPage} /> */}
                        </Flex>
                    </Flex>
                </Flex>
                <Divider className={styles.divider} style={{ margin: "0" }} />
                {/* Карточки */}
                <Flex wrap justify="between" className={styles["cards-wrapper"]}>
                    {userGames && userGames.length > 0 ? (
                        userGames.map((g) => (
                            <GameCard
                                key={g.id}
                                gameInfo={g}
                                openDetails={openDetailsModal}
                                updateUsersGames={refreshGames}
                            />
                        ))
                    ) : debouncedSearch ? (
                        <EmptyItems />
                    ) : (
                        <></>
                    )}
                </Flex>
                {/* Пагинация и статус загрузки */}
                {isPending && (
                    <div style={{ textAlign: "center", marginTop: 8 }}>
                        <Loader size="large" tip="Загрузка..." />
                    </div>
                )}
                {isError && <div style={{ color: "red" }}>Ошибка при загрузке игр.</div>}
                {isPending ? null : <Paginations totalItems={totalItems} currentPage={page} pageSize={pageSize} onChange={setPage} />}

                {/* Модалки */}
                <CreateGameModal isModalOpen={modalCreateGame} closeModal={closeModal} onGameCreated={refreshGames} />
                <AddGamesModal isModalOpen={modalAddGames} closeModal={closeModal} onAddGames={refreshGames} />
                <GameDetailModal gameInfo={detailsGameInfo} isModalOpen={detailsModal} closeModal={() => setDetailsModal(false)} updateUsersGames={refreshGames}/>
            </Flex>
        </>
    );
};
