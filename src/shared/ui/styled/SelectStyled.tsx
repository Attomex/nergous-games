import { ConfigProvider, ThemeConfig } from "antd";
import { GeneralInterfaceProps } from "./model";

export const SelectStyled: React.FC<GeneralInterfaceProps> = ({ children, globalToken = {} }) => {
    const theme: ThemeConfig = {
        token: globalToken,
        components: {
            Select: {
                activeBorderColor: "var(--main-secondary-color)",
                hoverBorderColor: "var(--main-secondary-color)",

                activeOutlineColor: "none",
                clearBg: "var(--text-color)",

                multipleItemBg: "var(--main-background-color)",
                selectorBg: "var(--main-background-color)",
                colorText: "var(--text-color)",

                optionSelectedColor: "var(--text-secondary-color)",
                optionSelectedBg: "var(--accent-color)",

                controlItemBgHover: "var(--main-third-color)",
            },
        },
    };

    return <ConfigProvider theme={theme}>{children}</ConfigProvider>;
};
