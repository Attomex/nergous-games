import React from "react";
import styles from "./SearchInput.module.css";

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    width?: number;
}

export const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, placeholder = "Поиск...", width = 300 }) => {
    return (
        <div className={`${styles["search-input-wrapper"]}`} style={{ maxWidth: width, width: width, height: 34 }}>
            <input
                id="search-input"
                className={`${styles["search-input"]}`}
                type="text"
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
            />
            {value && (
                <button className={`${styles["search-clear-btn"]}`} onClick={() => onChange("")}>
                    ×
                </button>
            )}
        </div>
    );
};
