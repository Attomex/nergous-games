import React, { useState, useMemo, useCallback, useEffect, use } from "react";
import GameCard from "../../features/gamePage/GameCard/GameCard";
import styles from "./GamePage.module.css";
import api from "../../api/api";
import { Button, Dropdown, Space, ConfigProvider, Tabs, Input, Select, Flex, Divider } from "antd";
import type { MenuProps, SelectProps } from "antd";
import CreateGameModal from "../../features/gamePage/CreateGameModal/CreateGameModal";
import AddGamesModal from "../../features/gamePage/AddGamesModal/AddGamesModal";
import { useAuth } from "../../context/AuthContext";
import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { ButtonStyled, DropdownStyled, SelectStyled, InputSearchStyled, DividerStyled } from "../../styled-components";
import Pagination from "../../features/Paginations/Paginations";
import { CalendarOutlined, FileTextOutlined, StarOutlined } from "@ant-design/icons";

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

interface Sort {
    field: "title" | "year" | "priority";
    order: "asc" | "desc";
}

const GamePage: React.FC = () => {
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState("");
    const [search, setSearch] = useState(""); // пользовательский ввод
    const [debouncedSearch, setDebouncedSearch] = useState(""); // значение с задержкой

    const [generalSort, setGeneralSort] = useState<Sort>({ field: "title", order: "desc" });

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
        queryKey: [
            "userGames",
            { status, page, page_size: pageSize, search: debouncedSearch, sort_by: generalSort.field, sort_order: generalSort.order },
        ],
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

    const fieldIcons = {
        title: <FileTextOutlined />,
        year: <CalendarOutlined />,
        priority: <StarOutlined />,
    };

    const DescIcon = () => {
        return (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ rotate: "90deg" }}>
                <path d="M6 20V4M18 20V16M12 20V10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        );
    };

    const AscIcon = () => {
        return (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ rotate: "90deg" }}>
                <path d="M18 20V4M6 20V16M12 20V10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        );
    };

    const options: SelectProps["options"] = [
        { label: "Название", value: JSON.stringify({ field: "title", order: "desc" }), icon: <DescIcon /> }, // по убыванию
        { label: "Название", value: JSON.stringify({ field: "title", order: "asc" }), icon: <AscIcon /> }, // по возрастанию
        { label: "Год", value: JSON.stringify({ field: "year", order: "desc" }), icon: <DescIcon /> }, // по убыванию
        { label: "Год", value: JSON.stringify({ field: "year", order: "asc" }), icon: <AscIcon /> }, // по возрастанию
        { label: "Приоритет", value: JSON.stringify({ field: "priority", order: "desc" }), icon: <DescIcon /> }, // по убыванию
        { label: "Приоритет", value: JSON.stringify({ field: "priority", order: "asc" }), icon: <AscIcon /> }, // по возрастанию
    ];

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
                                        }}
                                    >
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
                                    }}
                                >
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
                                    }}
                                >
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
                                    }}
                                >
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
                                    }}
                                >
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
                                    }}
                                >
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
                                    value={JSON.stringify(generalSort)}
                                    onChange={(v) => {
                                        setGeneralSort(JSON.parse(v));
                                        setPage(1);
                                    }}
                                    style={{ width: 200 }}
                                    optionLabelProp="label"
                                >
                                    {options.map((option) => (
                                        <Select.Option
                                            key={option.value}
                                            value={option.value}
                                            label={
                                                <span>
                                                    {option.icon} {option.label}
                                                </span>
                                            }
                                        >
                                            <span>
                                                {option.icon} {option.label}
                                            </span>
                                        </Select.Option>
                                    ))}
                                </Select>
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
        </>
    );
};

export default GamePage;
