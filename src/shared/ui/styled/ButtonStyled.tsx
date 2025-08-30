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
                defaultBg: "var(--main-background-color)",
                colorBorder: "var(--main-third-color)",

                defaultActiveColor: "white",
                defaultActiveBg: "var(--accent-color)",

                defaultHoverColor: "white",
                defaultHoverBg: "var(--main-secondary-color)",
                defaultHoverBorderColor: "var(--main-secondary-color)",
            },
        },
    };

    return <ConfigProvider theme={theme}>{children}</ConfigProvider>;
};
