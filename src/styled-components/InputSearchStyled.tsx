import { ConfigProvider, ThemeConfig } from "antd";
import { GeneralInterfaceProps } from "./GeneralInterface";

export const InputSearchStyled: React.FC<GeneralInterfaceProps> = ({ children, globalToken = {} }) => {
    const theme: ThemeConfig = {
        token: globalToken,
        components: {
            Input: {
                activeBorderColor: "var(--primary-color)",
                activeShadow: "var(--primary-color)",
                hoverBorderColor: "var(--primary-color)",
            },
        },
    };

    return <ConfigProvider theme={theme}>{children}</ConfigProvider>;
};
