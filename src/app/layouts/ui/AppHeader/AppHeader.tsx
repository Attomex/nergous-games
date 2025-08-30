import { Col, Row, Button, Dropdown, Space, Badge, Drawer, Menu, Typography } from "antd";
import {
    UserOutlined,
    BgColorsOutlined,
    MoonOutlined,
    InfoCircleOutlined,
    LogoutOutlined,
    SunOutlined,
    ToolOutlined,
    MenuOutlined,
    AppstoreOutlined,
    PlayCircleOutlined,
    SyncOutlined,
    BookOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import style from "./AppHeader.module.css";
import { useTheme } from "shared/theme";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "features/auth";
import { DropdownStyled } from "shared/ui";
import { useState, useMemo } from "react";

const { Text } = Typography;

export const AppHeader = () => {
    const { theme, setTheme, themes } = useTheme();
    const { logout, isAdmin, checkAdmin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const pageTitles: Record<string, string> = {
        "/all-games": "Все игры",
        "/games": "Мои игры",
        "/updates": "Обновления",
        "/profile": "Профиль",
        "/admin": "Панель администратора",
    };

    // Определяем название по текущему пути
    const currentTitle = useMemo(() => {
        return pageTitles[location.pathname] || "Главная";
    }, [location.pathname]);

    const onClick_theme: MenuProps["onClick"] = ({ key }) => {
        const selectedTheme = themes[Number(key) - 1];
        setTheme(selectedTheme);
    };

    const onClick_profile: MenuProps["onClick"] = ({ key }) => {
        if (key === "1") navigate("/profile");
        if (key === "2") {
            logout();
            navigate("/login");
        }
        if (key === "3") navigate("/admin");
    };

    const items_theme: MenuProps["items"] = [
        {
            key: "1",
            label: "Молочно-коричневый",
            extra: theme === "milk-brown" ? <Badge status="processing" /> : null,
            disabled: true,
        },
        {
            key: "2",
            label: "Молочно-зеленый",
            extra: theme === "milk-green" ? <Badge status="processing" /> : null,
            disabled: true,
        },
        { type: "divider" },
        {
            key: "3",
            label: "Светлая тема",
            icon: <SunOutlined style={{ color: "black" }} />,
            extra: theme === "light" ? <Badge status="processing" /> : null,
        },
        {
            key: "4",
            label: "Темная тема",
            icon: <MoonOutlined style={{ color: "black" }} />,
            extra: theme === "dark" ? <Badge status="processing" /> : null,
        },
        { type: "divider" },
        {
            key: "5",
            label: "Системная тема",
            icon: <UserOutlined style={{ color: "black" }} />,
            extra: theme.includes("system") ? <Badge status="processing" /> : null,
        },
    ];

    const items_profile: MenuProps["items"] = [
        { key: "1", label: "Информация", icon: <InfoCircleOutlined /> },
        { key: "2", label: "Выход", icon: <LogoutOutlined />, danger: true },
    ];

    if (isAdmin === "") checkAdmin();

    const adminPriv: MenuProps["items"] =
        isAdmin === true ? [{ type: "divider" }, { key: "3", label: "Панелька секретов", icon: <ToolOutlined /> }] : [];

    const items = [...items_profile, ...adminPriv] as MenuProps["items"];

    const iconMenuItems = [
        { key: "/all-games", icon: <AppstoreOutlined />, label: "Все игры" },
        { key: "/games", icon: <BookOutlined />, label: "Мои игры" },
        { key: "/updates", icon: <SyncOutlined />, label: "Обновления" },
    ];

    const isButtonActive = (url: string) => window.location.pathname === url;

    return (
        <div className={style.header}>
            <Row className={style.header__inner}>
                {/* Бургер + Заголовок */}
                <Col>
                    <Row align="middle" gutter={8}>
                        <Col>
                            <Button
                                type="text"
                                icon={
                                    <MenuOutlined
                                        style={{
                                            fontSize: "var(--header-font-size)",
                                            color: "var(--header-text-color)",
                                        }}
                                    />
                                }
                                onClick={() => setDrawerOpen(true)}
                            />
                        </Col>
                        <Col>
                            <Text
                                style={{
                                    color: "var(--header-text-color)",
                                    fontSize: "var(--header-font-size)",
                                    fontWeight: "var(--header-font-weight)",
                                }}>
                                {currentTitle}
                            </Text>
                        </Col>
                    </Row>
                </Col>

                {/* Настройки */}
                <Col className={style.settings}>
                    <DropdownStyled>
                        <Dropdown menu={{ items: items_theme, onClick: onClick_theme }} trigger={["click"]}>
                            <Space onClick={(e) => e.preventDefault()}>
                                <Button
                                    color="default"
                                    shape="circle"
                                    variant="text"
                                    icon={
                                        <BgColorsOutlined
                                            style={{
                                                color: "var(--header-text-color)",
                                                fontSize: "var(--header-font-size)",
                                            }}
                                        />
                                    }
                                />
                            </Space>
                        </Dropdown>
                        <Dropdown menu={{ items: items, onClick: onClick_profile }} trigger={["click"]}>
                            <Space onClick={(e) => e.preventDefault()}>
                                <Button
                                    color="default"
                                    shape="circle"
                                    variant="text"
                                    icon={
                                        <UserOutlined
                                            style={{
                                                color: "var(--header-text-color)",
                                                fontSize: "var(--header-font-size)",
                                            }}
                                        />
                                    }
                                />
                            </Space>
                        </Dropdown>
                    </DropdownStyled>
                </Col>
            </Row>

            {/* Drawer с меню */}
            <Drawer
                title="Меню"
                placement="left"
                onClose={() => setDrawerOpen(false)}
                open={drawerOpen}
                bodyStyle={{
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                }}>
                <div
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        borderTop: "1px solid var(--header-border-color)",
                    }}>
                    <Menu
                        mode="inline"
                        selectedKeys={[location.pathname]}
                        items={iconMenuItems}
                        onClick={({ key }) => {
                            navigate(key);
                            setDrawerOpen(false);
                        }}
                        style={{ borderRight: "none" }}
                    />
                </div>

                <div
                    style={{
                        padding: "10px 15px",
                        borderTop: "1px solid var(--header-border-color)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                    }}>
                    <Button
                        type="text"
                        icon={<InfoCircleOutlined />}
                        className={style.buttonGovno}
                        style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "flex-start",
                            textAlign: "left",
                            gap: 8,
                            marginBottom: 8,
                            color: "var(--header-text-color)",
                        }}
                        onClick={() => {
                            navigate("/profile");
                            setDrawerOpen(false);
                        }}>
                        Профиль
                    </Button>
                    <Button
                        type="text"
                        icon={<LogoutOutlined />}
                        danger
                        className={style.buttonGovno}
                        style={{ textAlign: "left", marginBottom: 8 }}
                        onClick={() => {
                            logout();
                            navigate("/login");
                            setDrawerOpen(false);
                        }}>
                        Выход
                    </Button>
                    {isAdmin === true && (
                        <Button
                            type="text"
                            icon={<ToolOutlined />}
                            className={style.buttonGovno}
                            style={{
                                textAlign: "left",
                                color: "var(--header-text-color)",
                            }}
                            onClick={() => {
                                navigate("/admin");
                                setDrawerOpen(false);
                            }}>
                            Панель администратора
                        </Button>
                    )}
                </div>
            </Drawer>
        </div>
    );
};
