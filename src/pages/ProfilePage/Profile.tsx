import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { User } from "../../context/AuthContext";
import { Divider, Image, Descriptions, ConfigProvider } from "antd";
import type { DescriptionsProps } from "antd";
import styles from "./Profile.module.css";

const img_src = process.env.REACT_APP_IMG_SRC_URL;

const Profile = () => {
    const { user, getUserInfo } = useAuth();
    const [userInfo, setUserInfo] = useState<User>({ email: "", steam_url: "", photo: "" });

    useEffect(() => {
        const getInfo = async () => {
            if (user === null) {
                setUserInfo(await getUserInfo());
            } else {
                setUserInfo(user);
            }
        };

        getInfo();
    }, [user]);

    const items: DescriptionsProps["items"] = [
        {
            key: "1",
            label: <div>Email</div>,
            children: userInfo.email,
        },
        {
            key: "2",
            label: "Steam URL",
            children: (
                <div
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                        navigator.clipboard.writeText(userInfo.steam_url);
                        console.log("Ссылка была скопирована");
                    }}
                >
                    {userInfo.steam_url}
                </div>
            ),
            
        },
    ];

    return (
        <div>
            <div className={styles.profile}>
                <Image
                    width={250}
                    height={250}
                    preview={false}
                    src={`${img_src}${userInfo.photo}`}
                    className={styles.profile__image}
                    style={{ borderRadius: "50%", objectFit: "cover" }}
                />
                <div className={styles.profile__info}>
                    <ConfigProvider
                        theme={{
                            token: {
                                fontSize: 18,
                            },
                        }}
                    >
                        <Descriptions title="Информация о пользователе" items={items} />
                    </ConfigProvider>
                </div>
            </div>

            <Divider style={{ backgroundColor: "var(--primary-color)" }} />
            <div>
                <h1>Статистика</h1>
            </div>
        </div>
    );
};

export default Profile;
