import { ConfigProvider, ThemeConfig } from "antd";
import { GeneralInterfaceProps } from "./model";

export const DividerStyled: React.FC<GeneralInterfaceProps> = ({ children, globalToken = {} }) => {
    const theme: ThemeConfig = {
        token: globalToken,
        components: {
            Divider: {
                colorSplit: "var(--main-third-color)",
            },
        },
    };

    return <ConfigProvider theme={theme}>{children}</ConfigProvider>;
};
