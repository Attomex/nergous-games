import React from "react";

export type DropdownItem = {
    id: number;
    label: string;
    value?: string;
    danger?: boolean;
    active?: boolean;
    icon?: React.ReactNode;
    extra?: React.ReactNode;
};

export type DropdownDivider = { type: "divider"; }

export type DropdownOption = DropdownItem | DropdownDivider;

type DropdownClickEvent = {
    key?: number,
    label?: string,
    value?: string,
    domEvent?: React.MouseEvent<HTMLLIElement>,
}

export type DropdownProps = {
    placeholder?: string;
    options: DropdownOption[];
    styles?: React.CSSProperties;
    className?: string;
    buttonStyle?: "shaped" | "default";
    buttonIcon?: React.ReactNode;
    onClick?: (event: DropdownClickEvent) => void;
}

export const isDropdownItem = (o: DropdownOption): o is DropdownItem => {
    return "id" in o;
};