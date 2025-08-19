import React from "react";
import { Input } from "antd";
import { InputSearchStyled } from "shared/ui";

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    width?: number;
}

export const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, placeholder = "Поиск...", width = 300 }) => {
    return (
        <InputSearchStyled
            globalToken={{
                colorPrimary: "var(--secondary-color)",
                colorIcon: "var(--secondary-color)",
            }}
        >
            <Input
                style={{
                    maxWidth: width,
                    height: "100%",
                }}
                placeholder={placeholder}
                allowClear
                value={value}
                suffix={null}
                onChange={(e) => {
                    onChange(e.target.value);
                }}
            />
        </InputSearchStyled>
    );
};
