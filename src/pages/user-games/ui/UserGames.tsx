import React, { useState, useCallback, useEffect } from "react";
import { GameCard } from "features/game-card";
import styles from "./UserGames.module.css";
import { api } from "shared/api";
import { Flex, Divider, Spin } from "antd";
import { CreateGameModal } from "features/create-game";
import { AddGamesModal } from "features/add-games";
import { useAuth } from "features/auth";
import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { DividerStyled } from "shared/ui";
import { Paginations } from "features/pagination";
import { LoadingOutlined } from "@ant-design/icons";
import { StatusButtonsGroup } from "./StatusButtonsGroup";
import { GameInfo } from "shared/types";
import { SortButton } from "widgets/sort-button";
import { Sort } from "shared/types";
import { AddGameButton } from "widgets/add-game-button";
import { useDebouncedSearch } from "shared/hooks";
import { SearchInput } from "widgets/search-input";

const fetchUserGames = async ({ queryKey }: { queryKey: any }) => {
    const [, params] = queryKey;
    const res = await api().get("/games/user", { params });
    return res.data; // { data: GameInfo[], pages, total }
};

export const UserGames: React.FC = () => {
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState("");
    const { search, debouncedSearch, setSearch } = useDebouncedSearch("", setPage, 500);

    const [generalSort, setGeneralSort] = useState<Sort>({ field: "title", order: "asc" });

    const [modalCreateGame, setModalCreateGame] = useState(false);
    const [modalAddGames, setModalAddGames] = useState(false);

    const { checkAdmin } = useAuth();
    const queryClient = useQueryClient();

    const pageSize = 12;
    const { data, isPending, isError } = useQuery({
        queryKey: [
            "userGames",
            { status, page, page_size: pageSize, search: debouncedSearch, sort_by: generalSort.field, sort_order: generalSort.order },
        ],
        queryFn: fetchUserGames,
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false,
    });

    const userGames: GameInfo[] = data?.data ?? [];
    const totalItems: number = data?.total ?? 0;

    const closeModal = () => {
        setModalCreateGame(false);
        setModalAddGames(false);
    };

    const refreshGames = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ["userGames"] });
    }, [queryClient]);

    useEffect(() => {
        checkAdmin();
    }, [checkAdmin]);

    return (
        <>
            <Flex vertical style={{ maxWidth: 1400, margin: "0 auto", gap: 16 }}>
                {/* Верхняя панель */}
                <Flex vertical align="start" gap="middle">
                    <AddGameButton openModalCreateGame={setModalCreateGame} openModalAddGames={setModalAddGames} />

                    <Flex gap="middle" style={{ width: "100%" }}>
                        <Flex gap="middle">
                            <StatusButtonsGroup status={status} setStatus={setStatus} setPage={setPage} />
                        </Flex>

                        <Flex gap="middle" style={{ marginLeft: "auto" }}>
                            <SearchInput value={search} onChange={setSearch} placeholder="Поиск игр..." width={300} />

                            <SortButton value={generalSort} onChange={setGeneralSort} onPageReset={setPage} />
                        </Flex>
                    </Flex>
                </Flex>
                <DividerStyled>
                    <Divider className={styles.divider} style={{ margin: "0" }} />
                </DividerStyled>
                {/* Карточки */}
                <Flex wrap="wrap" justify="space-between" gap={30} style={{ width: "100%" }}>
                    {userGames && userGames.length > 0 ? (
                        userGames.map((g) => (
                            <GameCard key={g.id} gameInfo={g} updateUsersGames={() => queryClient.invalidateQueries({ queryKey: ["userGames"] })} />
                        ))
                    ) : (
                        <div>Пусто</div>
                    )}
                </Flex>
                {/* Пагинация и статус загрузки */}
                {isPending && (
                    <div style={{ textAlign: "center", marginTop: 8 }}>
                        <Spin indicator={<LoadingOutlined spin />} size="large" tip="Загрузка..." />
                    </div>
                )}
                {isError && <div style={{ color: "red" }}>Ошибка при загрузке игр.</div>}
                {isPending ? null : <Paginations totalItems={totalItems} currentPage={page} pageSize={pageSize} onChange={setPage} />}

                {/* Модалки */}
                <CreateGameModal isModalOpen={modalCreateGame} closeModal={closeModal} onGameCreated={refreshGames} />
                <AddGamesModal isModalOpen={modalAddGames} closeModal={closeModal} onAddGames={refreshGames} />
            </Flex>
        </>
    );
};
