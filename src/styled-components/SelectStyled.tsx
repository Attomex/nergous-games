import { ConfigProvider, ThemeConfig } from "antd";
import { GeneralInterfaceProps } from "./GeneralInterface";

export const SelectStyled: React.FC<GeneralInterfaceProps> = ({ children, globalToken = {} }) => {
    const theme: ThemeConfig = {
        token: globalToken,
        components: {
            Select: {
                activeBorderColor: "var(--primary-color)",
                hoverBorderColor: "var(--primary-color)",
                activeOutlineColor: "none",
                clearBg: "var(--text-color)",
                multipleItemBg: "white",
                selectorBg: "white",
                optionSelectedColor: "var(--primary-color)",
                optionSelectedBg: "var(--secondary-color)",
            },
        },
    };

    return <ConfigProvider theme={theme}>{children}</ConfigProvider>;
};
