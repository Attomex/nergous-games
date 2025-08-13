import GameCard from "../../features/gamePage/GameCard/GameCard";
import styles from "./GamePage.module.css";
import api from "../../api/api";
import { useState, useEffect } from "react";
import { Button, Dropdown, Space } from "antd";
import type { MenuProps } from "antd";
import CreateGameModal from "../../features/gamePage/CreateGameModal/CreateGameModal";
import AddGamesModal from "../../features/gamePage/AddGamesModal/AddGamesModal";
import { useAuth } from "../../context/AuthContext";

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

// const test = async () => {
//     try {
//         await api()
//             .post("/games/multi", { names: ["allala", "Dota 2", "sjdhdjhsd"] })
//             .then((response) => {
//                 console.log(response);
//             })
//             .catch((error) => {
//                 throw new Error(error.response.data);
//             });
//     } catch (err) {
//         console.log(err);
//     }
// };

const items: MenuProps["items"] = [
    {
        key: "1",
        label: "Создать игру",
    },
    {
        key: "2",
        label: "Добавить игры",
    },
];

const GamePage = () => {
    const [userGames, setUserGames] = useState<GameInfo[]>([]);
    const [loadingGames, setLoadingGames] = useState<boolean>(false);
    const [modalCreateGame, setModalCreateGame] = useState<boolean>(false);
    const [modalAddGames, setModalAddGames] = useState<boolean>(false);
    const [pagination, setPagination] = useState(1);
    const [sizePages, setSizePages] = useState(1);
    const { checkAdmin } = useAuth();

    const onClick: MenuProps["onClick"] = ({ key }) => {
        if (key === "1") {
            setModalCreateGame(true);
        } else if (key === "2") {
            setModalAddGames(true);
        }
    };

    const closeModal = () => {
        setModalCreateGame(false);
        setModalAddGames(false);
    };

    const getUserGames = async () => {
        setLoadingGames(true);
        try {
            await api()
                .get("/games/user?page=" + pagination)
                .then((response) => {
                    setUserGames(response.data.data);
                    setSizePages(response.data.pages);
                })
                .catch((error) => {
                    throw new Error(error.response.data);
                });
        } catch (err) {
            console.log(err);
        } finally {
            setLoadingGames(false);
        }
    };

    useEffect(() => {
        getUserGames();
    }, [pagination]);

    useEffect(() => {
        checkAdmin();
    }, []);

    const changePagination = (page: number) => {
        setPagination((prev) => prev + page);
    };

    return (
        <>
            <div style={{ marginBottom: "20px" }}>
                <Dropdown menu={{ items, onClick }} trigger={["click"]}>
                    <Space>
                        <Button>Добавить</Button>
                    </Space>
                </Dropdown>
                <Space>
                    {pagination === sizePages ? null : <Button onClick={() => changePagination(1)}>Следующая страница</Button>}

                    {pagination === 1 ? null : <Button onClick={() => changePagination(-1)}>Предыдущая страница</Button>}
                </Space>
                <div style={{ marginLeft: "10px", marginRight: "10px" }}>
                    Страница {pagination} из {sizePages}
                </div>
            </div>
            {userGames !== undefined ? (
                <div className={styles.cardsWrapper}>
                    {userGames.map((g) => (
                        <GameCard key={g.id} gameInfo={g} updateUsersGames={getUserGames} />
                    ))}
                </div>
            ) : null}
            <Space>
                {pagination === sizePages ? null : <Button onClick={() => changePagination(1)}>Следующая страница</Button>}

                {pagination === 1 ? null : <Button onClick={() => changePagination(-1)}>Предыдущая страница</Button>}
            </Space>
            <div style={{ marginLeft: "10px", marginRight: "10px" }}>
                Страница {pagination} из {sizePages}
            </div>
            <CreateGameModal isModalOpen={modalCreateGame} closeModal={closeModal} onGameCreated={getUserGames} />
            <AddGamesModal isModalOpen={modalAddGames} closeModal={closeModal} onAddGames={getUserGames} />
        </>
    );
};

export default GamePage;
