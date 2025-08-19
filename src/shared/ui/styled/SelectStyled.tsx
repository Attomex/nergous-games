import { ConfigProvider, ThemeConfig } from "antd";
import { GeneralInterfaceProps } from "./model";

export const SelectStyled: React.FC<GeneralInterfaceProps> = ({ children, globalToken = {} }) => {
    const theme: ThemeConfig = {
        token: globalToken,
        components: {
            Select: {
                activeBorderColor: "var(--third-color)",
                hoverBorderColor: "var(--secondary-color)",

                activeOutlineColor: "none",
                clearBg: "var(--text-color)",

                multipleItemBg: "white",
                selectorBg: "var(--primary-color)",
                colorText: "var(--text-color)",

                optionSelectedColor: "var(--text-reverse-color)",
                optionSelectedBg: "var(--accent-color)",

                controlItemBgHover: "var(--secondary-color)",
                controlItemBgActiveHover: "var(--text-reverse-color)",
            },
        },
    };

    return <ConfigProvider theme={theme}>{children}</ConfigProvider>;
};
