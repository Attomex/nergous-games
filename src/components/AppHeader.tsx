import { Col, Row, Button, Dropdown, Space, ConfigProvider, Badge } from "antd";
import { UserOutlined, BgColorsOutlined, MoonOutlined, InfoCircleOutlined, LogoutOutlined, SunOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import style from "./modules/AppHeader.module.css";
import { useTheme } from "../provider/ThemeProvider";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { DropdownStyled } from "../styled-components";

const AppHeader = () => {
    const { theme, setTheme, themes } = useTheme();
    const { logout } = useAuth();
    const navigate = useNavigate();

    const onClick_theme: MenuProps["onClick"] = ({ key }) => {
        const selectedTheme = themes[Number(key) - 1];
        setTheme(selectedTheme);
    };

    const onClick_profile: MenuProps["onClick"] = ({ key }) => {
        if (key === "2") {
            logout();
            navigate("/login");
        }
        if (key === "1") {
            navigate("/profile");
        }
    };

    const items_theme: MenuProps["items"] = [
        {
            key: "1",
            label: "Молочно-коричневый",
            extra: theme === "milk-brown" ? <Badge status="processing" /> : null,
        },

        {
            key: "2",
            label: "Молочно-зеленый",
            extra: theme === "milk-green" ? <Badge status="processing" /> : null,
        },
        {
            type: "divider",
        },
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
        {
            type: "divider",
        },
        {
            key: "5",
            label: "Системная тема",
            icon: <UserOutlined style={{ color: "black" }} />,
            extra: theme.includes("system") ? <Badge status="processing" /> : null,
        },
    ];

    const items_profile: MenuProps["items"] = [
        {
            key: "1",
            label: "Информация",
            icon: <InfoCircleOutlined />,
        },
        {
            key: "2",
            label: "Выход",
            icon: <LogoutOutlined />,
            danger: true,
        },
    ];

    const isButtonActive = (url: string) => {
        if (window.location.pathname === url) {
            return true;
        }
        return false;
    };

    return (
        <div className={style.header}>
            <div>
                <ConfigProvider
                    theme={{
                        components: {
                            Button: {
                                textHoverBg: "var(--bg-color)",
                            },
                        },
                    }}>
                    <Row align="middle">
                        <Col span={8} className={style.logo}>
                            <div
                                onClick={() => {
                                    window.location.href = "https://i.ytimg.com/vi/PVyFj52G3no/maxresdefault.jpg";
                                }}>
                                не тыкать
                            </div>
                        </Col>
                        <Col span={8}>
                            <div className={style.menu}>
                                <button
                                    onClick={() => navigate("/all-games")}
                                    className={style.games__page__btn + (isButtonActive("/all-games") ? " " + style.active : "")}>
                                    Все игры
                                </button>
                                <button
                                    onClick={() => navigate("/games")}
                                    className={style.games__page__btn + (isButtonActive("/games") ? " " + style.active : "")}>
                                    Мои игры
                                </button>
                                <button
                                    onClick={() => navigate("/updates")}
                                    className={style.games__page__btn + (isButtonActive("/updates") ? " " + style.active : "")}>
                                    Обновления
                                </button>
                            </div>
                        </Col>
                        <Col span={8} className={style.settings}>
                            <DropdownStyled>
                                <Dropdown menu={{ items: items_theme, onClick: onClick_theme }} trigger={["click"]}>
                                    {/* <a onClick={(e) => e.preventDefault()}> */}
                                    <Space onClick={(e) => e.preventDefault()}>
                                        <Button
                                            color="default"
                                            shape="circle"
                                            variant="text"
                                            icon={<BgColorsOutlined style={{ color: "var(--text-color)", fontSize: "16px" }} />}
                                        />
                                    </Space>
                                    {/* </a> */}
                                </Dropdown>
                                <Dropdown menu={{ items: items_profile, onClick: onClick_profile }} trigger={["click"]}>
                                    {/* <a onClick={(e) => e.preventDefault()}> */}
                                    <Space onClick={(e) => e.preventDefault()}>
                                        <Button
                                            color="default"
                                            shape="circle"
                                            variant="text"
                                            icon={<UserOutlined style={{ color: "var(--text-color)", fontSize: "16px" }} />}
                                        />
                                    </Space>
                                    {/* </a> */}
                                </Dropdown>
                            </DropdownStyled>
                        </Col>
                    </Row>
                </ConfigProvider>
            </div>
        </div>
    );
};

export default AppHeader;
