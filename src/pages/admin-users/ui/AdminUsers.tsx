import { useQuery, keepPreviousData } from "@tanstack/react-query";
import api from "shared/api";
import { IUser } from "../model";
import { UserCard } from "./UserCard";
import styles from "./AdminUsers.module.css"

const fetchUsers = async () => {
    const res = await api.get("/users");
    return res.data.users;
};

export const AdminUsers = () => {
    const { data: users = [], refetch } = useQuery({
        queryKey: ["users"],
        queryFn: fetchUsers,
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false,
    });

    // const userTag = whoIs(data[0].isAdmin);

    return (
        <>
            <div style={{ maxWidth: "1400px", margin: "0 auto", gap: 16 }}>
                <h1 style={{ color: "var(--text-color)" }}>Пользователи</h1>
                <div className={styles.cardsWrapper}>
                    {users.length > 0 ? (
                        users.map((user: IUser) => (
                            <UserCard key={user.id} user={user} refetch={refetch} />
                        ))
                    ) : (
                        <div>Пользователи не найдены</div>
                    )}
                </div>
            </div>

            
        </>
    );
};
