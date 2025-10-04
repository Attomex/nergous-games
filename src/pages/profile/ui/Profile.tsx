import { useEffect, useState } from "react";
import { useAuth } from "features/auth";
import { User } from "shared/types";
import { Image, Typography, Tooltip } from "antd";
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { statsColors, IMG_SRC } from "shared/const";
import { CopyOutlined } from "@ant-design/icons";
import styles from "./Profile.module.css";
import { Badge } from "./Badge";
import { showErrorNotification, showSuccessNotification } from "shared/lib";

export const Profile = () => {
    const { user, getUserInfo } = useAuth();
    const [userInfo, setUserInfo] = useState<User>({
        email: "...",
        steam_url: "...",
        photo: "",
        stats: { finished: 0, playing: 0, planned: 0, dropped: 0 },
    });

    useEffect(() => {
        const getInfo = async () => {
            if (user) {
                setUserInfo(user);
            } else {
                const fetchedInfo = await getUserInfo();
                setUserInfo(fetchedInfo);
            }
        };
        getInfo();
    }, [user, getUserInfo]);

    ChartJS.register(ArcElement, ChartTooltip, Legend);

    const chartData = {
        labels: ["Завершено", "В планах", "В процессе", "Брошено"],
        datasets: [
            {
                data: [userInfo.stats.finished, userInfo.stats.planned, userInfo.stats.playing, userInfo.stats.dropped],
                backgroundColor: [statsColors.finished, statsColors.planned, statsColors.playing, statsColors.dropped],
                borderWidth: 0,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { enabled: true },
        },
        cutout: "70%",
    };

    const statsItems = [
        { label: "Завершено", value: userInfo.stats.finished, color: statsColors.finished },
        { label: "В планах", value: userInfo.stats.planned, color: statsColors.planned },
        { label: "В процессе", value: userInfo.stats.playing, color: statsColors.playing },
        { label: "Брошено", value: userInfo.stats.dropped, color: statsColors.dropped },
    ];

    return (
        <div className={styles.profilePage}>
            <div className={styles.profileCard}>
                <Typography.Title level={2} className={styles.user}>
                    Пользователь
                </Typography.Title>
                <Image width={150} height={150} src={`${IMG_SRC}${userInfo.photo}`} preview={false} className={styles.profileImage} />
                <div className={styles.profileInfo}>
                    <Typography.Text className={styles.userInfoText}>Email: {userInfo.email}</Typography.Text>
                    <div className={styles.steamContainer}>
                        <a className={`${styles.userInfoText} ${styles.steamLink}`} href={userInfo.steam_url} target="_blank" rel="noopener noreferrer">Steam: {userInfo.steam_url}</a>
                        <Tooltip title="Скопировать ссылку">
                            <CopyOutlined
                                className={styles.copyIcon}
                                onClick={() => {
                                    try {
                                        navigator.clipboard.writeText(userInfo.steam_url);
                                        showSuccessNotification("Ссылка скопирована");
                                    } catch {
                                        showErrorNotification("Не удалось скопировать ссылку");
                                    }
                                }}
                            />
                        </Tooltip>
                    </div>
                </div>
            </div>

            <div className={styles.statsCard}>
                <Typography.Title level={3} className={styles.cardTitle}>
                    Статистика
                </Typography.Title>
                <div className={styles.statsContent}>
                    <div className={styles.chartContainer}>
                        <Doughnut data={chartData} options={chartOptions} />
                    </div>
                    <div className={styles.legendContainer}>
                        {statsItems.map((item) => (
                            <div key={item.label} className={styles.legendItem}>
                                <Badge color={item.color} />
                                <span className={styles.legendLabel}>{item.label}:</span>
                                <span className={styles.legendValue}>{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.chartLegend}>
                    Всего {userInfo.stats.finished + userInfo.stats.planned + userInfo.stats.playing + userInfo.stats.dropped} игр
                </div>
            </div>
        </div>
    );
};
