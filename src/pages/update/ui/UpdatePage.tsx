import { Card, List, Typography, Divider, ConfigProvider } from "antd";
// import { updates } from "./updates";
import { useMemo, useState } from "react";
import styles from "./UpdatePage.module.css";
import "./fckngOVERRIDE.css";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;

// Можно сделать, чтобы у карточки border и у Divider цвет был --accent-color

function parseDate(date: string) {
    const [day, month, year] = date.split("-");

    return new Date(Number(year), Number(month) - 1, Number(day));
}

const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;

type Update = {
    date: string;
    title: string;
    update: Changes[];
};

// Changes is the type of the update array
type Changes = {
    name: string;
    desc: string;
};

export const UpdatePage = () => {
    const { t } = useTranslation("changes");
    const title = t("updates.title");
    const updates = t("updates.__updates__", { returnObjects: true }) as Update[];

    const firstDate = parseDate(updates[0].date);

    const dateDiff = useMemo(() => {
        const currDate = new Date();
        const differenceInMilliseconds = Math.abs(currDate.getTime() - firstDate.getTime());
        const differenceInDays = differenceInMilliseconds / MILLISECONDS_IN_A_DAY;
        return differenceInDays;
    }, [firstDate]);

    const [diffDates] = useState(Math.floor(dateDiff));

    const sortedUpdates = [...updates].sort((a, b) => {
        const [dayA, monthA, yearA] = a.date.split("-").map(Number);
        const [dayB, monthB, yearB] = b.date.split("-").map(Number);

        const dateA = new Date(yearA, monthA - 1, dayA);
        const dateB = new Date(yearB, monthB - 1, dayB);

        return dateB.getTime() - dateA.getTime(); // по убыванию (сначала новые)
    });

    return (
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px" }}>
            <ConfigProvider
                theme={{
                    components: {
                        Card: {
                            colorBgContainer: "var(--main-background-color)",
                            colorBorderSecondary: "var(--main-secondary-color)",
                            headerPaddingSM: 0,
                        },
                        List: {
                            colorSplit: "var(--secondary-color)",
                        },
                    },
                }}
            >
                <Title level={2} style={{ color: "var(--text-color)" }}>
                    {title}
                </Title>
                <Divider style={{ borderBlockStart: "1px solid var(--text-color)" }} />
                {sortedUpdates.map((updateItem, index) => (
                    <Card
                        key={index}
                        style={{ marginBottom: 20 }}
                        className={styles.card}
                        title={
                            <>
                                <div className={styles["card-header"]}>
                                    <Title level={3} style={{ color: "var(--text-color)", margin: "auto 0" }}>
                                        {updateItem.title}
                                    </Title>
                                    <Text type="secondary" style={{ color: "var(--text-color)", margin: "auto 0" }}>
                                        {updateItem.date}
                                    </Text>
                                    {diffDates < 7 && index === 0 && <span className={styles.new}>NEW</span>}
                                </div>
                            </>
                        }
                    >
                        <List
                            dataSource={updateItem.update}
                            renderItem={(change, index) => (
                                <List.Item style={{ paddingBottom: 0 }}>
                                    <List.Item.Meta
                                        title={
                                            <Text strong style={{ color: "var(--text-color)" }}>
                                                {change.name}
                                            </Text>
                                        }
                                        description={
                                            <Text style={{ color: "var(--text-color)" }}>
                                                {change.desc}
                                                {index !== updateItem.update.length - 1 && (
                                                    <Divider
                                                        type="horizontal"
                                                        style={{ backgroundColor: "var(--gray-light-color)", marginTop: 12, marginBottom: 0 }}
                                                    />
                                                )}
                                            </Text>
                                        }
                                    ></List.Item.Meta>
                                </List.Item>
                            )}
                        />
                    </Card>
                ))}
            </ConfigProvider>
        </div>
    );
};
