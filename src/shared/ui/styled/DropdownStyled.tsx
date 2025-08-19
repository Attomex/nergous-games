import { ConfigProvider, ThemeConfig } from "antd";
import { GeneralInterfaceProps } from "./model";

export const DropdownStyled: React.FC<GeneralInterfaceProps> = ({ children, globalToken = {} }) => {
    const theme: ThemeConfig = {
        token: globalToken,
        components: {
            Dropdown: {
                controlItemBgHover: "var(--secondary-color)", // Фон при наведении
            },
        },
    };

    return <ConfigProvider theme={theme}>{children}</ConfigProvider>;
};
