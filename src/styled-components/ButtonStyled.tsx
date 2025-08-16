import { ConfigProvider, ThemeConfig } from "antd";
import { GeneralInterfaceProps } from "./GeneralInterface";

export const ButtonStyled: React.FC<GeneralInterfaceProps> = ({ children, globalToken = {} }) => {
    const theme: ThemeConfig = {
        token: globalToken,
        components: {
            Button: {
                colorText: "var(--text-color)",
                defaultBg: "var(--primary-color)",
                colorBorder: "var(--bg-color)",
                defaultActiveColor: "var(--text-color)",
                defaultActiveBg: "var(--primary-color)",
                defaultActiveBorderColor: "var(--bg-color)",
                defaultHoverColor: "var(--primary-color)",
                defaultHoverBg: "var(--secondary-color)",
                defaultHoverBorderColor: "var(--secondary-color)",
            },
        },
    };

    return <ConfigProvider theme={theme}>{children}</ConfigProvider>;
};
