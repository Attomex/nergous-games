import { Card, List, Typography, Divider, ConfigProvider } from "antd";
import { updates } from "./updates";

const { Title, Text } = Typography;

const Update = () => {
    return (
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px" }}>
            <ConfigProvider
                theme={{
                    components: {
                        Card: {
                            colorBgContainer: "var(--primary-color)",
                            colorBorderSecondary: "var(--secondary-color)",
                        },
                    },
                }}
            >
                <Title level={2} style={{ color: "var(--text-color)" }}>
                    Обновления
                </Title>
                <Divider style={{ borderBlockStart: "1px solid var(--text-color)" }} />
                {sortedUpdates.map((updateItem, index) => (
                    <Card
                        key={index}
                        style={{ marginBottom: 20 }}
                        title={
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "center" }}>
                                <Title level={3} style={{ marginBottom: "24px", color: "var(--text-color)" }}>
                                    {updateItem.title}
                                </Title>
                                <Text type="secondary" style={{ color: "var(--text-color)" }}>
                                    {updateItem.date}
                                </Text>
                            </div>
                        }
                    >
                        <List
                            dataSource={updateItem.update}
                            renderItem={(change) => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={
                                            <Text strong style={{ color: "var(--text-color)" }}>
                                                {change.name}
                                            </Text>
                                        }
                                        description={
                                            <Text style={{ color: "var(--text-color)" }}>
                                                {change.desc}
                                            </Text>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                ))}
            </ConfigProvider>
        </div>
    );
};

const sortedUpdates = [...updates].sort((a, b) => {
    const [dayA, monthA, yearA] = a.date.split("-").map(Number);
    const [dayB, monthB, yearB] = b.date.split("-").map(Number);

    const dateA = new Date(yearA, monthA - 1, dayA);
    const dateB = new Date(yearB, monthB - 1, dayB);

    return dateB.getTime() - dateA.getTime(); // по убыванию (сначала новые)
});

export default Update;
