import { useEffect } from "react";
import { useAuth } from "features/auth";
import { Image, Typography, Tooltip } from "antd";
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { statsColors, IMG_SRC } from "shared/const";
import { CopyOutlined } from "@ant-design/icons";
import styles from "./Profile.module.css";
import { Badge } from "./Badge";
import { showErrorNotification, showSuccessNotification } from "shared/lib";
import { useTranslation } from "react-i18next";

export const Profile = () => {
    const { user, getUserInfo } = useAuth();
    const { t } = useTranslation("translation", { keyPrefix: "profilePage" });

    useEffect(() => {
        getUserInfo();
    }, [getUserInfo]);

    ChartJS.register(ArcElement, ChartTooltip, Legend);

    const chartData = {
        labels: [t("chart.label.finished"), t("chart.label.planned"), t("chart.label.playing"), t("chart.label.dropped")],
        datasets: [
            {
                data: [user?.stats.finished, user?.stats.planned, user?.stats.playing, user?.stats.dropped],
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
        { label: t("chart.label.finished"), value: user?.stats.finished, color: statsColors.finished },
        { label: t("chart.label.planned"), value: user?.stats.planned, color: statsColors.planned },
        { label: t("chart.label.playing"), value: user?.stats.playing, color: statsColors.playing },
        { label: t("chart.label.dropped"), value: user?.stats.dropped, color: statsColors.dropped },
    ];

    return (
        <div className={styles.profilePage}>
            <div className={styles.profileCard}>
                <Typography.Title level={2} className={styles.user}>
                    {t("user")}
                </Typography.Title>
                <Image src={`${IMG_SRC}${user?.photo}`} preview={false} className={styles.profileImage} />
                <div className={styles.profileInfo}>
                    <Typography.Text className={styles.userInfoText}>Email: {user?.email}</Typography.Text>
                    <div className={styles.steamContainer}>
                        <a
                            className={`${styles.userInfoText} ${styles.steamLink}`}
                            href={user?.steam_url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Steam: {user?.steam_url}
                        </a>
                        <Tooltip title={t("tooltip")}>
                            <CopyOutlined
                                className={styles.copyIcon}
                                onClick={() => {
                                    try {
                                        navigator.clipboard.writeText(user?.steam_url as string);
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
                    {t("chart.title")}
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
            </div>
        </div>
    );
};
