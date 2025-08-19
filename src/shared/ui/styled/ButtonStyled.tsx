import { ConfigProvider, ThemeConfig } from "antd";
import { GeneralInterfaceProps } from "./model";

export const ButtonStyled: React.FC<GeneralInterfaceProps> = ({ children, globalToken = {} }) => {
    const theme: ThemeConfig = {
        token: globalToken,
        components: {
            Button: {
                borderRadius: 10,
                controlHeight: 35,

                colorText: "var(--text-color)",
                defaultBg: "var(--primary-color)",
                colorBorder: "var(--bg-color)",

                defaultActiveColor: "var(--text-color)",
                defaultActiveBg: "var(--accent-color)",
                defaultActiveBorderColor: "var(--bg-color)",

                defaultHoverColor: "white",
                defaultHoverBg: "var(--secondary-color)",
                defaultHoverBorderColor: "var(--secondary-color)",
            },
        },
    };

    return <ConfigProvider theme={theme}>{children}</ConfigProvider>;
};
