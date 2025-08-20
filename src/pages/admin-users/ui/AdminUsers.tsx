import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { api } from "shared/api";
import { TUser } from "../model";
import { UserCard } from "./UserCard";

const fetchUsers = async () => {
    const res = await api().get("/users");
    console.log(res.data.users);
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
                <div className="cardsWrapper" style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                    {users.length > 0 ? (
                        users.map((user: TUser) => (
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
