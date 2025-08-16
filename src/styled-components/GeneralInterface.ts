import { GlobalToken } from "antd";

export interface GeneralInterfaceProps {
    children: React.ReactNode;
    globalToken?: Partial<GlobalToken>;
}