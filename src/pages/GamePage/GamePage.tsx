import React, { useState, useMemo, useCallback, useEffect } from "react";
import GameCard from "../../features/gamePage/GameCard/GameCard";
import styles from "./GamePage.module.css";
import api from "../../api/api";
import { Button, Dropdown, Space, Pagination, ConfigProvider, Tabs, Input, Select } from "antd";
import type { MenuProps } from "antd";
import CreateGameModal from "../../features/gamePage/CreateGameModal/CreateGameModal";
import AddGamesModal from "../../features/gamePage/AddGamesModal/AddGamesModal";
import { useAuth } from "../../context/AuthContext";
import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import Config from "chart.js/dist/core/core.config";
import "./zaebalo.css";

export interface GameInfo {
    id: number;
    title: string;
    preambula: string;
    image: string;
    developer: string;
    publisher: string;
    year: string;
    genre: string;
    url: string;
    status: string;
    priority: number;
}

const itemsGame: MenuProps["items"] = [
    { key: "1", label: "Создать игру" },
    { key: "2", label: "Добавить игры" },
];

const fetchUserGames = async ({ queryKey }: { queryKey: any }) => {
    const [, params] = queryKey;
    const res = await api().get("/games/user", { params });
    return res.data; // { data: GameInfo[], pages, total }
};

const GamePage: React.FC = () => {
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState("");
    const [search, setSearch] = useState(""); // пользовательский ввод
    const [debouncedSearch, setDebouncedSearch] = useState(""); // значение с задержкой

    const [sortBy, setSortBy] = useState<"title" | "year" | "priority">("title");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    const [modalCreateGame, setModalCreateGame] = useState(false);
    const [modalAddGames, setModalAddGames] = useState(false);

    const { checkAdmin } = useAuth();
    const queryClient = useQueryClient();

    // debounce на 500 мс
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1); // при изменении поиска сбрасываем на первую страницу
        }, 500);
        return () => clearTimeout(handler);
    }, [search]);

    const pageSize = 12;
    const { data, isPending, isError } = useQuery({
        queryKey: ["userGames", { status, page, page_size: pageSize, search: debouncedSearch, sort_by: sortBy, sort_order: sortOrder }],
        queryFn: fetchUserGames,
        placeholderData: keepPreviousData,
        // staleTime: 1000 * 60 * 2,
        refetchOnWindowFocus: false,
    });

    const userGames: GameInfo[] = data?.data ?? [];
    const totalItems: number = data?.total ?? 0;

    const onClick: MenuProps["onClick"] = ({ key }) => {
        if (key === "1") setModalCreateGame(true);
        else if (key === "2") setModalAddGames(true);
    };

    const closeModal = () => {
        setModalCreateGame(false);
        setModalAddGames(false);
    };

    const refreshGames = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ["userGames"] });
    }, [queryClient]);

    const statuses: { [key: string]: string } = {
        "1": "",
        "2": "finished",
        "3": "planned",
        "4": "playing",
        "5": "dropped",
    };

    const onChangeTab = useCallback(
        (key: string) => {
            setStatus(statuses[key]);
            setPage(1);
        },
        [statuses]
    );

    const GamesList = useMemo(() => {
        return (
            <>
                <Pagination
                    className="styled-pagination"
                    total={totalItems}
                    current={page}
                    align="center"
                    showQuickJumper
                    showSizeChanger={false}
                    pageSize={pageSize}
                    onChange={(p) => setPage(p)}
                    locale={{
                        page: "",
                        jump_to: "Перейти к",
                    }}
                />

                <div className={styles.cardsWrapper}>
                    {userGames !== undefined && userGames.length > 0 ? (
                        userGames.map((g) => (
                            <GameCard key={g.id} gameInfo={g} updateUsersGames={() => queryClient.invalidateQueries({ queryKey: ["userGames"] })} />
                        ))
                    ) : (
                        <div>Пусто</div>
                    )}
                </div>

                {isPending && <div style={{ textAlign: "center", marginTop: 8 }}>Обновление...</div>}
                {isError && <div style={{ color: "red" }}>Ошибка при загрузке игр.</div>}
            </>
        );
    }, [userGames, totalItems, page, isPending, isError, queryClient]);

    const tabItems = useMemo(() => {
        const commonProps = { children: GamesList };
        return [
            { key: "1", label: "Все", ...commonProps },
            { key: "2", label: "Завершенные", ...commonProps },
            { key: "3", label: "Запланировано", ...commonProps },
            { key: "4", label: "В процессе", ...commonProps },
            { key: "5", label: "Брошено", ...commonProps },
        ];
    }, [GamesList]);

    useEffect(() => {
        checkAdmin();
    }, [checkAdmin]);

    return (
        <>
            <div style={{ marginBottom: 20, display: "flex", gap: 16, alignItems: "center" }}>
                <Dropdown menu={{ items: itemsGame, onClick }} trigger={["click"]}>
                    <Space>
                        <ConfigProvider
                            theme={{
                                components: {
                                    Button: {
                                        colorText: "var(--text-color)",
                                        defaultBg: "var(--primary-color)",
                                        colorBorder: "var(--bg-color)",
                                        defaultActiveColor: "var(--text-color)",
                                        defaultActiveBg: "var(--primary-color)",
                                        defaultActiveBorderColor: "var(--bg-color)",
                                        defaultHoverColor: "var(--primary-color)",
                                        defaultHoverBg: "var(--secondary-color)",
                                        defaultHoverBorderColor: "var(--secondary-color)",
                                    },
                                },
                            }}>
                            <Button>Добавить</Button>
                        </ConfigProvider>
                    </Space>
                </Dropdown>
                <ConfigProvider
                    theme={{
                        token: {
                            colorPrimary: "var(--primary-color)",
                            colorIcon: "var(--primary-color)",
                        },
                        components: {
                            Input: {
                                activeBorderColor: "var(--primary-color)",
                                activeShadow: "var(--primary-color)",
                                hoverBorderColor: "var(--primary-color)",
                            },
                            Button: {
                                defaultHoverBorderColor: "var(--primary-color)",
                                defaultActiveBorderColor: "var(--primary-color)",
                                defaultColor: "var(--primary-color)",
                                defaultActiveColor: "var(--primary-color)",
                                defaultHoverColor: "var(--primary-color)",
                            },
                            Select: {
                                activeBorderColor: "var(--primary-color)",
                                activeOutlineColor: "none",
                                clearBg: "var(--text-color)",
                                multipleItemBg: "white",
                                selectorBg: "white",
                                optionSelectedColor: "var(--primary-color)",
                                optionSelectedBg: "var(--secondary-color)",
                            },
                        },
                    }}>
                    <Input.Search
                        placeholder="Поиск игр..."
                        allowClear
                        style={{ maxWidth: 300 }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Select
                        value={sortBy}
                        onChange={(v) => {
                            setSortBy(v);
                            setPage(1);
                        }}
                        style={{ width: 140 }}
                        options={[
                            { label: "Название", value: "title" },
                            { label: "Год", value: "year" },
                            { label: "Приоритет", value: "priority" },
                        ]}
                    />

                    <Select
                        value={sortOrder}
                        onChange={(v) => {
                            setSortOrder(v);
                            setPage(1);
                        }}
                        style={{ width: 120 }}
                        options={[
                            { label: "По убыванию", value: "desc" },
                            { label: "По возрастанию", value: "asc" },
                        ]}
                    />
                </ConfigProvider>
            </div>

            <ConfigProvider
                theme={{
                    components: {
                        Tabs: {
                            cardBg: "var(--primary-color)",
                            itemColor: "var(--text-color)",
                            itemActiveColor: "var(--bg-color)",
                            itemHoverColor: "var(--secondary-color)",
                            itemSelectedColor: "var(--primary-color)",
                            cardGutter: 10,
                        },
                    },
                }}>
                <Tabs items={tabItems} type="card" defaultActiveKey="1" onChange={onChangeTab} />
            </ConfigProvider>

            <CreateGameModal isModalOpen={modalCreateGame} closeModal={closeModal} onGameCreated={refreshGames} />
            <AddGamesModal isModalOpen={modalAddGames} closeModal={closeModal} onAddGames={refreshGames} />
        </>
    );
};

export default GamePage;
