import React, { useState, useCallback, useEffect } from "react";
import GameCard from "../../features/gamePage/GameCard/GameCard";
import styles from "./AllGames.module.css";
import api from "../../api/api";
import { Button, Dropdown, Space, ConfigProvider, Input, Select, Divider, Flex, Spin } from "antd";
import type { MenuProps, SelectProps } from "antd";
import CreateGameModal from "../../features/gamePage/CreateGameModal/CreateGameModal";
import AddGamesModal from "../../features/gamePage/AddGamesModal/AddGamesModal";
import { useAuth } from "../../context/AuthContext";
import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import Pagination from "../../features/Paginations/Paginations";
import { ButtonStyled, DividerStyled, DropdownStyled, InputSearchStyled, SelectStyled } from "../../styled-components";
import { LoadingOutlined } from "@ant-design/icons";
import { DescIcon, AscIcon } from "../../features/Icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownAZ, faArrowDownZA } from "@fortawesome/free-solid-svg-icons";

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
    const res = await api().get("/games", { params });
    return res.data; // { data: GameInfo[], pages, total }
};

interface Sort {
    field: "title" | "year" | "priority";
    order: "asc" | "desc";
}

const AllGames: React.FC = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState(""); // пользовательский ввод
    const [debouncedSearch, setDebouncedSearch] = useState(""); // значение с задержкой

    const [generalSort, setGeneralSort] = useState<Sort>({ field: "title", order: "asc" });

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

    const pageSize = 18;
    const { data, isPending, isError } = useQuery({
        queryKey: ["allGames", { page, page_size: pageSize, search: debouncedSearch, sort_by: generalSort.field, sort_order: generalSort.order }],
        queryFn: fetchUserGames,
        placeholderData: keepPreviousData,
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

    useEffect(() => {
        checkAdmin();
    }, [checkAdmin]);

    const options: SelectProps["options"] = [
        { label: "Название", value: JSON.stringify({ field: "title", order: "asc" }), icon: <FontAwesomeIcon icon={faArrowDownAZ} /> }, // по возрастанию
        { label: "Название", value: JSON.stringify({ field: "title", order: "desc" }), icon: <FontAwesomeIcon icon={faArrowDownZA} /> }, // по убыванию
        { label: "Год", value: JSON.stringify({ field: "year", order: "desc" }), icon: <DescIcon /> }, // по убыванию
        { label: "Год", value: JSON.stringify({ field: "year", order: "asc" }), icon: <AscIcon /> }, // по возрастанию
        { label: "Приоритет", value: JSON.stringify({ field: "priority", order: "desc" }), icon: <DescIcon /> }, // по убыванию
        { label: "Приоритет", value: JSON.stringify({ field: "priority", order: "asc" }), icon: <AscIcon /> }, // по возрастанию
    ];

    return (
        <>
            <div style={{ marginBottom: 20, display: "flex" }}>
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
            </div>

            <DividerStyled>
                <Divider className={styles.divider} style={{ margin: "0" }} />
            </DividerStyled>

            {/* Карточки */}
            <Flex wrap="wrap" justify="space-between" gap={10} style={{ width: "100%" }}>
                {userGames && userGames.length > 0 ? (
                    userGames.map((g) => (
                        <GameCard key={g.id} gameInfo={g} updateUsersGames={() => queryClient.invalidateQueries({ queryKey: ["allGames"] })} />
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
            {isPending ? null : <Pagination totalItems={totalItems} currentPage={page} pageSize={pageSize} onChange={setPage} />}

            <CreateGameModal isModalOpen={modalCreateGame} closeModal={closeModal} onGameCreated={refreshGames} />
            <AddGamesModal isModalOpen={modalAddGames} closeModal={closeModal} onAddGames={refreshGames} />
        </>
    );
};

export default AllGames;
