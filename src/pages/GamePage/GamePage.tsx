import React, { useState, useMemo, useCallback, useEffect } from "react";
import GameCard from "../../features/gamePage/GameCard/GameCard";
import styles from "./GamePage.module.css";
import api from "../../api/api";
import { Button, Dropdown, Space, ConfigProvider, Tabs, Input, Select, Flex, Divider } from "antd";
import type { MenuProps } from "antd";
import CreateGameModal from "../../features/gamePage/CreateGameModal/CreateGameModal";
import AddGamesModal from "../../features/gamePage/AddGamesModal/AddGamesModal";
import { useAuth } from "../../context/AuthContext";
import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { ButtonStyled, DropdownStyled, SelectStyled, InputSearchStyled, DividerStyled } from "../../styled-components";
import Pagination from "../../features/Paginations/Paginations";

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
                <div className={styles.cardsWrapper}>
                    {userGames !== undefined && userGames.length > 0 ? (
                        userGames.map((g) => (
                            <GameCard key={g.id} gameInfo={g} updateUsersGames={() => queryClient.invalidateQueries({ queryKey: ["userGames"] })} />
                        ))
                    ) : (
                        <div>Пусто</div>
                    )}
                </div>

                <Pagination totalItems={totalItems} currentPage={page} pageSize={pageSize} onChange={setPage} />

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
            <Flex vertical style={{ maxWidth: 1400, margin: "0 auto", gap: 16 }}>
                {/* Верхняя панель */}
                <Flex vertical align="start" gap="middle">
                    <DropdownStyled>
                        <ButtonStyled>
                            <Dropdown menu={{ items: itemsGame, onClick }} trigger={["click"]}>
                                <Space>
                                    <ConfigProvider
                                        theme={{
                                            components: {
                                                Button: {
                                                    colorBorder: "rgba(var(--third-color-rgb), 0.5)",
                                                },
                                            },
                                        }}>
                                        <Button>Добавить новые игры</Button>
                                    </ConfigProvider>
                                </Space>
                            </Dropdown>
                        </ButtonStyled>
                    </DropdownStyled>
                    <Flex gap="middle" style={{ width: "100%" }}>
                        <Flex gap="middle">
                            <ButtonStyled>
                                <Button
                                    style={{
                                        backgroundColor: status === "" ? "var(--accent-color)" : "var(--primary-color)",
                                        color: status === "" ? "white" : "var(--text-color)",
                                    }}
                                    onClick={() => {
                                        setStatus("");
                                        setPage(1);
                                    }}>
                                    Все
                                </Button>
                                <Button
                                    style={{
                                        backgroundColor: status === "finished" ? "var(--accent-color)" : "var(--primary-color)",
                                        color: status === "finished" ? "white" : "var(--text-color)",
                                    }}
                                    onClick={() => {
                                        setStatus("finished");
                                        setPage(1);
                                    }}>
                                    Завершенные
                                </Button>
                                <Button
                                    style={{
                                        backgroundColor: status === "planned" ? "var(--accent-color)" : "var(--primary-color)",
                                        color: status === "planned" ? "white" : "var(--text-color)",
                                    }}
                                    onClick={() => {
                                        setStatus("planned");
                                        setPage(1);
                                    }}>
                                    Запланировано
                                </Button>
                                <Button
                                    style={{
                                        backgroundColor: status === "playing" ? "var(--accent-color)" : "var(--primary-color)",
                                        color: status === "playing" ? "white" : "var(--text-color)",
                                    }}
                                    onClick={() => {
                                        setStatus("playing");
                                        setPage(1);
                                    }}>
                                    В процессе
                                </Button>
                                <Button
                                    style={{
                                        backgroundColor: status === "dropped" ? "var(--accent-color)" : "var(--primary-color)",
                                        color: status === "dropped" ? "white" : "var(--text-color)",
                                    }}
                                    onClick={() => {
                                        setStatus("dropped");
                                        setPage(1);
                                    }}>
                                    Брошено
                                </Button>
                            </ButtonStyled>
                        </Flex>

                        <Flex gap="middle" style={{ marginLeft: "auto" }}>
                            <InputSearchStyled globalToken={{ colorPrimary: "var(--secondary-color)", colorIcon: "var(--secondary-color)" }}>
                                <Input
                                    style={{
                                        maxWidth: 300,
                                        height: "100%",
                                    }}
                                    placeholder="Поиск игр..."
                                    allowClear
                                    value={search}
                                    suffix={null}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </InputSearchStyled>

                            <SelectStyled>
                                <Select
                                    value={sortBy}
                                    onChange={(v) => {
                                        setSortBy(v);
                                        setPage(1);
                                    }}
                                    style={{ width: 160 }}
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
                                    style={{ width: 160 }}
                                    options={[
                                        { label: "По убыванию", value: "desc" },
                                        { label: "По возрастанию", value: "asc" },
                                    ]}
                                />
                            </SelectStyled>
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
                <Pagination totalItems={totalItems} currentPage={page} pageSize={pageSize} onChange={setPage} />
                {isPending && <div style={{ textAlign: "center", marginTop: 8 }}>Обновление...</div>}
                {isError && <div style={{ color: "red" }}>Ошибка при загрузке игр.</div>}

                {/* Модалки */}
                <CreateGameModal isModalOpen={modalCreateGame} closeModal={closeModal} onGameCreated={refreshGames} />
                <AddGamesModal isModalOpen={modalAddGames} closeModal={closeModal} onAddGames={refreshGames} />
            </Flex>

            {/* <ConfigProvider
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
                    <Tabs items={tabItems} style={{ maxWidth: "1400px" }} type="card" defaultActiveKey="1" onChange={onChangeTab} />
                </ConfigProvider> */}

            {/* <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12, marginLeft: 10 }}>
                    <Button
                        type={status === "" ? "primary" : "default"}
                        onClick={() => {
                            setStatus("");
                            setPage(1);
                        }}
                        aria-pressed={status === ""}>
                        Все
                    </Button>

                    <Button
                        type={status === "finished" ? "primary" : "default"}
                        onClick={() => {
                            setStatus("finished");
                            setPage(1);
                        }}
                        aria-pressed={status === "finished"}>
                        Завершенные
                    </Button>

                    <Button
                        type={status === "planned" ? "primary" : "default"}
                        onClick={() => {
                            setStatus("planned");
                            setPage(1);
                        }}
                        aria-pressed={status === "planned"}>
                        Запланировано
                    </Button>

                    <Button
                        type={status === "playing" ? "primary" : "default"}
                        onClick={() => {
                            setStatus("playing");
                            setPage(1);
                        }}
                        aria-pressed={status === "playing"}>
                        В процессе
                    </Button>

                    <Button
                        type={status === "dropped" ? "primary" : "default"}
                        onClick={() => {
                            setStatus("dropped");
                            setPage(1);
                        }}
                        aria-pressed={status === "dropped"}>
                        Брошено
                    </Button>
                </div>

                {/* Список карточек */}
            {/* <div style={{ maxWidth: "1400px" }}>{GamesList}</div> */}

            {/* <CreateGameModal isModalOpen={modalCreateGame} closeModal={closeModal} onGameCreated={refreshGames} /> */}
            {/* <AddGamesModal isModalOpen={modalAddGames} closeModal={closeModal} onAddGames={refreshGames} /> */}
            {/* </div> */}
        </>
    );
};

export default GamePage;
