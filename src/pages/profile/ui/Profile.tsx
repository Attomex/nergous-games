import { useEffect, useState } from "react";
import { useAuth } from "features/auth";
import { User } from "shared/types";
import { Divider, Image, Descriptions, ConfigProvider } from "antd";
import type { DescriptionsProps } from "antd";
import styles from "./Profile.module.css";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Badge } from "./Badge";
import { statsColors } from "shared/const";

const img_src = process.env.REACT_APP_IMG_SRC_URL;

export const Profile = () => {
    const { user, getUserInfo } = useAuth();
    const [userInfo, setUserInfo] = useState<User>({
        email: "",
        steam_url: "",
        photo: "",
        stats: { finished: 0, playing: 0, planned: 0, dropped: 0 },
    });

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

    ChartJS.register(ArcElement, Tooltip, Legend);

    const data = {
        labels: ["Завершено", "В планах", "В процессе", "Брошено"],
        datasets: [
            {
                label: "Количество",
                data: [userInfo.stats.finished, userInfo.stats.planned, userInfo.stats.playing, userInfo.stats.dropped],
                backgroundColor: [statsColors.finished, statsColors.planned, statsColors.playing, statsColors.dropped],
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: false,
            },
        },
        cutout: "45%",
        elements: {
            arc: {
                borderWidth: 0,
                spacing: 2,
            },
        },
        layout: {
            padding: 2,
        },
    };

    const items: DescriptionsProps["items"] = [
        {
            key: "1",
            label: "Email",
            children: userInfo.email,
            // label: "Email",
            // children: userInfo.email,
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
                            components: {
                                Descriptions: {
                                    colorText: "var(--text-color)",
                                    labelColor: "rgba(var(--text-color-rgb), 0.8)",
                                },
                            },
                        }}
                    >
                        <Descriptions title="Информация о пользователе" items={items} />
                    </ConfigProvider>
                </div>
            </div>

            <Divider style={{ borderBlockStart: "1px solid var(--text-color)" }} />
            <div className="user__stats">
                <h1 style={{ color: "var(--text-color)" }}>Статистика</h1>
                <div className="container" style={{ display: "flex", justifyContent: "space-between", width: "600px" }}>
                    <div className="stats" style={{ margin: "auto 0" }}>
                        <p style={{ color: "var(--text-color)" }}>
                            <Badge color={statsColors.finished} /> Завершено: {userInfo?.stats.finished}
                        </p>
                        <p style={{ color: "var(--text-color)" }}>
                            <Badge color={statsColors.planned} /> В планах: {userInfo?.stats.planned}
                        </p>
                        <p style={{ color: "var(--text-color)" }}>
                            <Badge color={statsColors.playing} /> В процессе: {userInfo?.stats.playing}
                        </p>
                        <p style={{ color: "var(--text-color)" }}>
                            <Badge color={statsColors.dropped} /> Брошено: {userInfo?.stats.dropped}
                        </p>
                    </div>
                    <div className="donut">
                        <Doughnut data={data} options={options} />
                    </div>
                </div>
            </div>
        </div>
    );
};
