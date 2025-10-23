import React, { useState, useCallback, useEffect } from "react";
import styles from "./AllGames.module.css";
import api from "shared/api";
import { CreateGameModal } from "features/create-game";
import { AddGamesModal } from "features/add-games";
import { useAuth } from "features/auth";
import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { Paginations } from "widgets/pagination";
import { Divider, Loader } from "shared/ui";
import { AddGameButton } from "widgets/add-game-button";
import { useDebouncedSearch } from "shared/hooks";
import { SearchInput } from "widgets/search-input";
import { Dropdown } from "widgets/dropdown";
import { DropdownOption, DropdownProps, GameInfo } from "shared/types";
import { isDropdownItem } from "shared/types";
import { AscIcon, DescIcon, SortAZIcon, SortZAIcon } from "widgets/icons";
import { useTranslation } from "react-i18next";
import { EmptyItems } from "widgets/empty-items";
import { GameCard } from "features/game-card";
import { GameDetailModal } from "features/game-detail";
import { Flex } from "shared/ui";

const fetchAllGames = async ({ queryKey }: { queryKey: any }) => {
    const [, params] = queryKey;
    const res = await api.get("/games", { params });
    return res.data; // { data: GameInfo[], pages, total }
};

export const AllGames: React.FC = () => {
    const [page, setPage] = useState(1);
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

    const pageSize = 18;
    const { data, isPending, isError } = useQuery({
        queryKey: [
            "allGames",
            { page, page_size: pageSize, search: debouncedSearch, sort_by: generalSort.split("-")[0], sort_order: generalSort.split("-")[1] },
        ],
        queryFn: fetchAllGames,
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false,
    });

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
        queryClient.invalidateQueries({ queryKey: ["allGames"] });
    }, [queryClient]);

    const sortHandleChange: DropdownProps["onClick"] = ({ value }) => {
        setGeneralSort(value as SortOption);
    };

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

    useEffect(() => {
        checkAdmin();
    }, [checkAdmin]);

    return (
        <>
            <Flex className={styles["top-panel"]}>
                <AddGameButton
                    placeholder={t("addGame.label")}
                    menuItems={menuItems}
                    openModalCreateGame={setModalCreateGame}
                    openModalAddGames={setModalAddGames}
                />
                <Flex gap={16} style={{ zIndex: 2 }} className={styles["top-panel__right"]}>
                    <SearchInput value={search} onChange={setSearch} placeholder={t("searchButton.placeholder")} width={300} />
                    <Dropdown
                        options={sortItems}
                        buttonIcon={sortItems.filter(isDropdownItem).find((item) => item.value === generalSort)?.icon}
                        placeholder={sortOptions[generalSort]}
                        onClick={sortHandleChange}
                        className={styles["sort-button"]}
                    />
                </Flex>
            </Flex>

            <Divider className={styles.divider} style={{ margin: "0" }} />

            {/* Карточки */}
            <Flex wrap justify="between" gap={10} style={{ width: "100%" }}>
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

            <CreateGameModal isModalOpen={modalCreateGame} closeModal={closeModal} onGameCreated={refreshGames} />
            <AddGamesModal isModalOpen={modalAddGames} closeModal={closeModal} onAddGames={refreshGames} />
            <GameDetailModal gameInfo={detailsGameInfo} isModalOpen={detailsModal} closeModal={() => setDetailsModal(false)} updateUsersGames={refreshGames} />
        </>
    );
};
